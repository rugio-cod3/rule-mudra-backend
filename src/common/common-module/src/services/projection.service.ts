import { HttpStatusCode } from 'axios'
import ejs from 'ejs'
import moment from 'moment'
import path from 'path'
import puppeteer from 'puppeteer'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid' // For generating unique IDs
import XLSX from 'xlsx'
import { BadRequestError } from '../errors'
import { IProjectionReportPayload } from '../interfaces/crm.interface'
import { IServiceResponse } from '../interfaces/service.interface'
import { convertToDate, convertToMySQLDateTime } from '../utils/dateTimeFunction'
import { getKnexInstance } from '../utils/mysql'
import { IFileUrlPayloadProjection } from '../validations/projection.validator'
import ResponseService from './response.service'
import S3Service from './thirdParty/s3.service'

class ProjectionService extends ResponseService {
  private readonly s3Service = new S3Service()
  async uploadProjectionFile(payload: IFileUrlPayloadProjection): Promise<IServiceResponse> {
    const { image, type, userId } = payload
    const db = getKnexInstance()
    let parsedData: any[] = []

    parsedData = type === 'xlsx' ? this.parseXLSX(image.buffer) : await this.parseCSV(image.buffer)

    if (parsedData.length === 0) {
      throw new Error('No data available for insertion')
    }
    const validXLSXHeaders = [
      'Date',
      'Time',
      'Campaign',
      'Disposition',
      'Next Action DateTime',
      'Loan No.',
      'Mobile',
      'RepayDate',
    ]

    const validCSVHeaders = [
      'Phone Number',
      'Sent Timestamp (UTC time)',
      'Delivered Timestamp (UTC time)',
      'Read Timestamp (UTC time)',
      'Replied Timestamp (IST time)',
    ]

    if (type === 'xlsx') {
      const headers = Object.keys(parsedData[0])
      const trimmedHeaders = headers.map(header => header.trim().replace(/[\r\n\t]/g, ''))
      const isValid = trimmedHeaders.every(header => validXLSXHeaders.includes(header))
      const hasNoExtraHeaders = trimmedHeaders.length === validXLSXHeaders.length

      if (!isValid || !hasNoExtraHeaders) {
        throw new BadRequestError(
          `Invalid headers in XLSX file. Expected headers: ${validXLSXHeaders.join(', ')}`,
        )
      }
    }

    if (type === 'csv') {
      const headers = Object.keys(parsedData[0])
      const trimmedHeaders = headers.map(header => header.trim().replace(/[\r\n\t]/g, ''))
      const isValid = trimmedHeaders.every(header => validCSVHeaders.includes(header))
      const hasNoExtraHeaders = trimmedHeaders.length === validCSVHeaders.length

      if (!isValid || !hasNoExtraHeaders) {
        throw new BadRequestError(
          `Invalid headers in CSV file. Expected headers: ${validCSVHeaders.join(', ')}`,
        )
      }
    }

    let normalizedData = parsedData.map(row => {
      const normalizedRow: Record<string, any> = {}
      Object.keys(row).forEach(key => {
        normalizedRow[key.trim()] = row[key]
      })
      return normalizedRow
    })

    try {
      const sanitizedData =
        type === 'xlsx' ? this.sanitizeXLSXData(normalizedData) : this.sanitizeCSVData(parsedData)

      const uploadedTrack = uuidv4()
      const filename = `${Math.floor(Date.now() / 1000)}/${uploadedTrack}.${image.originalname}`
      const folder = `documents/disposition/csv`
      const s3UploadResponse = await this.s3Service.uploadDocument(image.buffer, folder, filename)
      if (!s3UploadResponse) {
        throw new BadRequestError('File extension is not allowed.')
      }

      const key = `${folder}/${filename}`
      const csvlink = await this.s3Service.getPresignedUrl(key)

      await db.transaction(async trx => {
        const CHUNK_SIZE = 1000
        for (let i = 0; i < sanitizedData.length; i += CHUNK_SIZE) {
          const chunk = sanitizedData.slice(i, i + CHUNK_SIZE)
          await this.processChunk(chunk, trx, type, uploadedTrack)
        }
      })
      const data = {
        fileName: filename,
        userID: userId,
        filelink: csvlink,
        fileId: uploadedTrack,
        type: type === 'xlsx' ? 'call_disposition' : 'whatsapp_disposition',
      }
      await db('projection_filelog').insert(data)
      if (image.buffer) {
        image.buffer = null
        console.log('Buffer cleared successfully')
      }
      const fileType = type === 'xlsx' ? 'call_disposition' : 'whatsapp_disposition'
      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          recordsInserted: parsedData.length,
          totalRecord: parsedData.length,
          failedRecord: 0,
          fileId: uploadedTrack,
          fileType: fileType,
        },
        'File data successfully uploaded and inserted into the database',
      )
    } catch (error) {
      console.error('Transaction failed:', error.message)
      throw error
    }
  }

  parseXLSX(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
  }

  private async parseCSV(buffer: Buffer): Promise<any[]> {
    const parsedData = await this.parseCSVFromBuffer(buffer)
    return parsedData
  }

  private sanitizeXLSXData(parsedData: any[]): any[] {
    return parsedData.map(row => ({
      call_date: row['Date'] || null,
      call_time: row['Time'] || null,
      loan_no: row['Loan No.'] || null,
      campaign: row['Campaign'] || null,
      disposition: row['Disposition'] || null,
      next_action_datetime: convertToMySQLDateTime(row['Next Action DateTime']) || null,
      customer_mobile: row['Mobile'] || null,
      repay_date: convertToDate(row['RepayDate']) || null,
    }))
  }

  private sanitizeCSVData(parsedData: any[]): any[] {
    return parsedData.map(row => ({
      phone_number: row['Phone Number'] || null,
      sent_timestamp: row['Sent Timestamp (UTC time)'] || null,
      delivered_timestamp: row['Delivered Timestamp (UTC time)'] || null,
      read_timestamp: row['Read Timestamp (UTC time)'] || null,
      replied_timestamp: row['Replied Timestamp (IST time)']
        ? moment(row['Replied Timestamp (IST time)'], 'D/M/YYYY HH:mm').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : null,
    }))
  }
  private processChunk = async (
    chunk: any[],
    trx: any,
    type: string,
    fileId: string,
  ): Promise<void> => {
    const isXlsx = type === 'xlsx'
    const table = isXlsx ? 'call_dispositions' : 'whatsapp_dispositions'
    const keyColumn = isXlsx ? 'loan_no' : 'phone_number'

    let loanMap: Record<string, string> = {}
    if (!isXlsx) {
      const phoneNumbers = chunk.map(row => row.phone_number).filter(Boolean)
      const loanData = await trx('customer')
        .whereIn('mobile', phoneNumbers)
        .join('loan', 'customer.customerID', '=', 'loan.customerID')
        .select('customer.mobile as phone_number', 'loan.loanNo')
        .orderBy('loan.loanID', 'desc')
        .groupBy('customer.mobile', 'loan.loanNo')
        .limit(1)
      loanMap = loanData.reduce((acc, { phone_number, loanNo }) => {
        acc[phone_number] = loanNo
        return acc
      }, {})
    }
    const insertBatch = []
    chunk.forEach(row => {
      let failedReason = null
      let loanNo = isXlsx ? null : loanMap[row.phone_number] || null

      if (isXlsx) {
        if (!row.loan_no && !row.customer_mobile) {
          failedReason = 'loanNo and  mobile not exists'
        }
        if (!row.loan_no && row.customer_mobile) {
          failedReason = 'loanNo  not exists'
        }
        if (!row.customer_mobile && row.loan_no) {
          failedReason = 'mobile not exists'
        }
      } else {
        if (!row.phone_number) {
          failedReason = 'mobile not exists'
        }
      }
      if (failedReason) {
        if (isXlsx) {
          insertBatch.push({
            ...row,
            failed_reason: failedReason,
            fileId: fileId,
          })
        } else {
          insertBatch.push({
            ...row,
            failed_reason: failedReason,
            loan_no: loanNo,
            fileId: fileId,
          })
        }
      } else {
        if (!isXlsx) {
          insertBatch.push({
            ...row,
            loan_no: loanNo,
            failed_reason: null,
            fileId: fileId,
          })
        } else {
          insertBatch.push({
            ...row,
            failed_reason: null,
            fileId: fileId,
          })
        }
      }
    })

    if (insertBatch.length > 0) {
      await trx(table).insert(insertBatch)
    }
  }

  private parseCSVFromBuffer(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const rows: any[] = []
      const stream = require('stream')
      const bufferStream = new stream.PassThrough()
      bufferStream.end(buffer)

      bufferStream
        .pipe(require('csv-parser')())
        .on('data', (row: string) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (error: any) => reject(error))
    })
  }

  async callMonitoringData(startDate: Date, endDate: Date): Promise<IServiceResponse> {
    const db = getKnexInstance()

    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    let totalCallCountForDate = 0

    const dateRange = this.getDateRange(startDate, endDate)

    const data: any = {}

    for (let date of dateRange) {
      const DPD: any[] = []
      const formattedDate = formatDate(date)
      const loanCounts = await this.getLoanCountForDate(date)

      for (let i = -7; i <= 7; i++) {
        const adjustedDate = new Date(date)
        adjustedDate.setDate(adjustedDate.getDate() + i)
        const approvalAndCallCounts = await this.getApprovalAndCallCountsForDate(date, adjustedDate)

        const due = loanCounts - (approvalAndCallCounts?.approvalCount ?? 0)

        const callCount = approvalAndCallCounts?.callCount ?? 0

        totalCallCountForDate += callCount

        DPD.push({
          due: `Due- ${due}`,
          callCount: approvalAndCallCounts?.callCount ?? 0,
          callDate: formatDate(adjustedDate),
          repayDate: formattedDate,
        })
      }

      data[formattedDate] = {
        NumberOfUsersDueDate: loanCounts,
        DPD: DPD,
        totalCallsMade: totalCallCountForDate,
      }
      totalCallCountForDate = 0
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      data,
      'Call Monitoring Data fetched successfully',
    )
  }
  // private async getLoanCountsForDateRange(
  //   dateRange: Date[],
  // ): Promise<{ [key: string]: number }> {
  //   const db = getKnexInstance()

  //   // Format dates as 'YYYY-MM-DD' for database queries
  //   const formattedDates = dateRange.map(
  //     (date) => date.toISOString().split('T')[0],
  //   )
  //  // console.log('formattedDates:', formattedDates)

  //   try {
  //     // Construct the raw SQL query
  //     const sqlQuery = `
  //       SELECT COUNT(DISTINCT a.leadID) AS loanCount, DATE(a.repayDate) AS repayDate
  //       FROM approval a
  //       INNER JOIN loan l ON a.leadID = l.leadID
  //       WHERE DATE(a.repayDate) IN (?)
  //       AND l.status = 'Disbursed'
  //       GROUP BY DATE(a.repayDate);
  //     `

  //     // Execute the query with the formattedDates array
  //     const result = await db.raw(sqlQuery, [formattedDates])

  //     //console.log('result:', result)

  //     // Initialize loanCounts object with default values of 0
  //     const loanCounts: { [key: string]: number } = {}
  //     formattedDates.forEach((date) => {
  //       loanCounts[date] = 0
  //     })

  //     // Populate loanCounts with actual data from the query result
  //     result[0].forEach((row: any) => {
  //       const formattedRepayDate = new Date(row.repayDate)
  //         .toISOString()
  //         .split('T')[0] // Format to 'YYYY-MM-DD'
  //       if (loanCounts.hasOwnProperty(formattedRepayDate)) {
  //         loanCounts[formattedRepayDate] = row.loanCount
  //       }
  //     })

  //     return loanCounts
  //   } catch (error) {
  //     console.error('Error fetching loan counts:', error)
  //     throw new Error('Unable to fetch loan counts')
  //   }
  // }

  private async getLoanCountForDate(date: Date): Promise<number> {
    const db = getKnexInstance()

    const formattedDate = date.toISOString().split('T')[0]

    try {
      const sqlQuery = `
        SELECT COUNT(DISTINCT a.leadID) AS loanCount
        FROM approval a
        INNER JOIN loan l ON a.leadID = l.leadID
        WHERE DATE(a.repayDate) = ?
        AND l.status = 'Disbursed';
      `
      const result = await db.raw(sqlQuery, [formattedDate])

      const loanCount = result[0][0]?.loanCount || 0

      return loanCount
    } catch (error) {
      console.error('Error fetching loan count:', error)
      throw new BadRequestError('Unable to fetch loan count')
    }
  }

  private async getApprovalAndCallCountsForDate(
    date: Date,
    callDate: Date,
  ): Promise<{ approvalCount: number; callCount: number }> {
    const db = getKnexInstance()

    const formattedDate = date.toISOString().split('T')[0]
    const formattedCallDate = callDate.toISOString().split('T')[0]

    const approvalCountResult = await db.raw(
      `
      SELECT COUNT(DISTINCT a.leadID) AS approvalCount
      FROM approval a
      INNER JOIN \`callhistoryLogs\` c ON a.leadID = c.leadID
      WHERE DATE(a.repayDate) = ?
      AND c.status IN ('Settlement', 'Closed')
      AND c.createdDate <= ?
      `,
      [formattedDate, formattedCallDate],
    )

    // Query for call count
    const callCountResult = await db.raw(
      `
      SELECT COUNT(*) AS callCount
      FROM \`call_dispositions\` c
      WHERE DATE(c.repay_date) = ?
      AND DATE(c.call_date) = ?
      AND c.loan_no IS NOT NULL
      `,
      [formattedDate, formattedCallDate],
    )

    const approvalCount = approvalCountResult[0][0]?.approvalCount || 0
    const callCount = callCountResult[0][0]?.callCount || 0

    return { approvalCount, callCount }
  }

  private getTotalCallsMade = async (
    repayDate: Date,
    startDate: Date,
    endDate: Date,
  ): Promise<number> => {
    const db = getKnexInstance()

    const formattedDate = repayDate.toISOString().split('T')[0]
    const formattedStartDate = startDate.toISOString().split('T')[0]
    const formattedEndDate = endDate.toISOString().split('T')[0]

    try {
      const result = await db.raw(
        `
        SELECT COUNT(*) AS callTotalCount
        FROM approval a
        INNER JOIN \`call_dispositions\` c ON a.repayDate = c.repay_date
        WHERE a.repayDate = ?
        AND c.call_date BETWEEN ? AND ?
      `,
        [formattedDate, formattedStartDate, formattedEndDate],
      )
      return result[0][0].callTotalCount
    } catch (error) {
      console.error('Error fetching total call count:', error)
      throw new Error('Unable to fetch total call count')
    }
  }

  private getDateRange(startDate: Date, endDate: Date): Date[] {
    const dateRange = []
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateRange
  }

  async callDescriptionData(callDate: Date, repayDate: Date): Promise<IServiceResponse> {
    const db = getKnexInstance()

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]
    }

    const formattedCallDate = formatDate(callDate)
    const formattedRepayDate = formatDate(repayDate)

    const dispositions = await db('call_dispositions')
      .select('loan_no', 'disposition', 'call_date', 'repay_date')
      .where('call_date', formattedCallDate)
      .andWhere('repay_date', formattedRepayDate)

    const userCallData: Record<string, any> = {}

    dispositions.forEach(row => {
      const { loan_no, disposition } = row

      if (loan_no === null) return

      if (!userCallData[loan_no]) {
        userCallData[loan_no] = {
          userCount: 1,
          attemptedCallsCount: 0,
          connectedCallsCount: 0,
          totalCallsMade: 0,
        }
      } else {
        userCallData[loan_no].userCount += 1
      }

      userCallData[loan_no].totalCallsMade += 1

      if (disposition === 'NC' || disposition === 'NR') {
        userCallData[loan_no].attemptedCallsCount += 1
      } else {
        userCallData[loan_no].connectedCallsCount += 1
      }
    })

    const data = {
      calls: {},
      Total: {
        totalUserCount: 0,
        attemptedCallsCount: 0,
        connectedCallsCount: 0,
      },
      AverageCalls: {
        minimumCallsMade: null,
        maximumCallsMade: null,
        AverageCallsMade: 0,
        MedianCallsMade: 0,
      },
    }

    const totalCalls = []

    Object.keys(userCallData).forEach(loan_no => {
      const { userCount, attemptedCallsCount, connectedCallsCount, totalCallsMade } =
        userCallData[loan_no]

      const frequency = totalCallsMade

      const callGroup = `${frequency}x calls`

      data.Total.totalUserCount += userCount
      data.Total.attemptedCallsCount += attemptedCallsCount
      data.Total.connectedCallsCount += connectedCallsCount

      if (!data.calls[callGroup]) {
        data.calls[callGroup] = {
          userCount: userCount,
          attemptedCallsCount: attemptedCallsCount,
          connectedCallsCount: connectedCallsCount,
        }
      } else {
        data.calls[callGroup].userCount += userCount
        data.calls[callGroup].attemptedCallsCount += attemptedCallsCount
        data.calls[callGroup].connectedCallsCount += connectedCallsCount
      }

      totalCalls.push(attemptedCallsCount + connectedCallsCount)

      if (totalCallsMade != null) {
        if (
          data.AverageCalls.minimumCallsMade === null ||
          totalCallsMade < data.AverageCalls.minimumCallsMade
        ) {
          data.AverageCalls.minimumCallsMade = totalCallsMade
        }
        if (
          data.AverageCalls.maximumCallsMade === null ||
          totalCallsMade > data.AverageCalls.maximumCallsMade
        ) {
          data.AverageCalls.maximumCallsMade = totalCallsMade
        }
      }
    })

    Object.keys(data.calls).forEach(callGroup => {
      const groupData = data.calls[callGroup]
      const frequency = parseInt(callGroup.split('x')[0])

      // groupData.userCount /= frequency
      // groupData.attemptedCallsCount /= frequency
      // groupData.connectedCallsCount /= frequency

      groupData.userCount = Math.floor(groupData.userCount / frequency)
      groupData.attemptedCallsCount = Math.floor(groupData.attemptedCallsCount / frequency)
      groupData.connectedCallsCount = Math.floor(groupData.connectedCallsCount / frequency)
    })

    data.Total.totalUserCount = 0
    data.Total.attemptedCallsCount = 0
    data.Total.connectedCallsCount = 0

    Object.keys(data.calls).forEach(callGroup => {
      const groupData = data.calls[callGroup]
      data.Total.totalUserCount += groupData.userCount
      data.Total.attemptedCallsCount += groupData.attemptedCallsCount
      data.Total.connectedCallsCount += groupData.connectedCallsCount
    })

    if (data.Total.totalUserCount > 0) {
      data.AverageCalls.AverageCallsMade = +(
        totalCalls.reduce((acc, curr) => acc + curr, 0) / data.Total.totalUserCount
      ).toFixed(2)
    }

    totalCalls.sort((a, b) => a - b)
    const middle = Math.floor(totalCalls.length / 2)

    if (totalCalls.length > 0) {
      totalCalls.sort((a, b) => a - b)
      const middle = Math.floor(totalCalls.length / 2)

      if (totalCalls.length % 2 === 0) {
        data.AverageCalls.MedianCallsMade = (totalCalls[middle - 1] + totalCalls[middle]) / 2
      } else {
        data.AverageCalls.MedianCallsMade = totalCalls[middle]
      }
    } else {
      data.AverageCalls.MedianCallsMade = 0
    }

    data.AverageCalls.minimumCallsMade = data.AverageCalls.minimumCallsMade ?? 0
    data.AverageCalls.maximumCallsMade = data.AverageCalls.maximumCallsMade ?? 0

    return this.serviceResponse(
      HttpStatusCode.Ok,
      data,
      'Call Description Data fetched successfully',
    )
  }

  async projectionReport(payload: IProjectionReportPayload): Promise<IServiceResponse> {
    const { startDate, endDate } = payload

    const db = getKnexInstance()

    const result = await db('leads')
      .select(
        db.raw('COALESCE(emi.dueDate, approval.repayDate) AS `dueDate`'),
        db.raw('COUNT(DISTINCT loan.loanNo) AS `dueCases`'),
        db.raw(`
          SUM(CASE 
            WHEN leads.productID = 1 THEN emi.amountPayable
            WHEN leads.productID = 2 THEN loan.disbursalAmount + 
              (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
          END) AS 'dueAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN (emi.status IN ('paid', 'partially-paid')) OR (collection.collectionStatus = 'Approved') THEN loan.loanNo
          END) AS 'paidUsers'`),
        db.raw(`
          SUM(CASE 
            WHEN emi.status IN ('paid', 'partially-paid') THEN emi.paymentReceived
            WHEN collection.collectionStatus = 'Approved' THEN collection.collectedAmount
          END) AS 'paidAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN emi.status = 'paid' OR leads.status = 'Closed' THEN loan.loanNo
          END) AS 'fullyPaid'`),
        db.raw(`
          SUM(CASE 
            WHEN emi.status = 'paid' THEN emi.paymentReceived
            WHEN leads.status = 'Closed' THEN loan.disbursalAmount + 
              (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
          END) AS 'fullyPaidAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN emi.status = 'partially-paid' OR leads.status = 'Part Payment' THEN loan.loanNo
          END) AS 'partiallyPaid'`),
        db.raw(`
          SUM(CASE 
            WHEN emi.status = 'partially-paid' THEN emi.paymentReceived
            WHEN leads.status = 'Part Payment' THEN collection.collectedAmount
          END) AS 'partiallyPaidAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN emi.status = 'due' OR leads.status = 'Disbursed' THEN loan.loanNo
          END) AS 'unpaidUsers'`),
        db.raw(`
          SUM(CASE 
            WHEN emi.status = 'due' THEN emi.amountPayable
            WHEN leads.status = 'Disbursed' THEN loan.disbursalAmount + 
              (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
          END) AS 'unpaidAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'PTP' THEN loan.loanNo
          END) AS 'PTP'`),
        db.raw(`
          SUM(CASE 
            WHEN cd.disposition = 'PTP' THEN 
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount + 
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
              END
          END) AS 'ptpAmount'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'PTP' THEN loan.loanNo 
          END)) OVER () AS 'totalPTP'`),
        db.raw(`
          SUM(SUM(CASE 
            WHEN cd.disposition = 'PTP' THEN 
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount +
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
              END 
          END)) OVER () AS 'totalPtpAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'Callback' THEN loan.loanNo
          END) AS 'callback'`),
        db.raw(`
          SUM(CASE 
            WHEN cd.disposition = 'callback' THEN 
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount + 
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
              END
          END) AS 'callbackAmount'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'callback' THEN loan.loanNo 
          END)) OVER () AS 'totalCallback'`),
        db.raw(`
          SUM(SUM(CASE 
            WHEN cd.disposition = 'callback' THEN 
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount +
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
              END 
          END)) OVER () AS 'totalCallbackAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN loan.loanNo
          END) AS 'brokenPTP'`),
        db.raw(`
          SUM(CASE 
            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN 
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount + 
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
              END
          END) AS 'brokenPtpAmount'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN loan.loanNo
          END)) OVER () AS 'totalBrokenPTP'`),
        db.raw(`
          SUM(SUM(CASE 
            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN 
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount + 
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
              END
          END)) OVER () AS 'totalBrokenPtpAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN wd.read_timestamp IS NOT NULL THEN loan.loanNo
          END) AS 'messageRead'`),

        db.raw(`
          SUM(CASE 
            WHEN wd.read_timestamp IS NOT NULL THEN
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount +
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
                END
          END) AS 'messageReadAmount'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN wd.read_timestamp IS NOT NULL THEN loan.loanNo
          END)) OVER () AS 'totalMessageRead'`),
        db.raw(`
          SUM(SUM(CASE 
            WHEN wd.read_timestamp IS NOT NULL THEN
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount +
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
                END
          END)) OVER () AS 'totalMessageReadAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'RTP' THEN loan.loanNo
          END) AS 'RTP'`),
        db.raw(`
          SUM(CASE 
            WHEN cd.disposition = 'RTP' THEN
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount +
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
                END
          END) AS 'rtpAmount'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'RTP' THEN loan.loanNo
          END)) OVER () AS 'totalRTP'`),
        db.raw(`
          Sum(SUM(CASE 
            WHEN cd.disposition = 'RTP' THEN
              CASE 
                WHEN leads.productID = 1 THEN emi.amountPayable
                WHEN leads.productID = 2 THEN loan.disbursalAmount +
                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))
                END
          END)) OVER () AS 'totalRtpAmount'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'NC' THEN loan.loanNo
          END) AS 'NC'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'NC' THEN loan.loanNo
          END)) OVER () AS 'totalNC'`),
        db.raw(`
          COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'NR' THEN loan.loanNo
          END) AS 'NR'`),
        db.raw(`
          SUM(COUNT(DISTINCT CASE 
            WHEN cd.disposition = 'NR' THEN loan.loanNo
          END)) OVER () AS 'totalNR'`),
        db.raw(`
          CASE 
            WHEN COUNT(DISTINCT loan.loanNo) = 0 THEN 0
            ELSE ((COUNT(DISTINCT CASE 
                      WHEN (emi.status IN ('paid', 'partially-paid')) OR (collection.collectionStatus = 'Approved') THEN loan.loanNo
                    END) +
                    COUNT(DISTINCT CASE 
                      WHEN cd.disposition = 'PTP' THEN loan.loanNo
                    END) -
                    COUNT(DISTINCT CASE 
                      WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN loan.loanNo
                    END)
                  ) * 100.0) / COUNT(DISTINCT loan.loanNo)
          END AS 'projection'`),
      )
      .leftJoin('approval', 'leads.leadID', 'approval.leadID')
      .leftJoin('loan', 'leads.leadID', 'loan.leadID')
      .leftJoin('collection', 'leads.leadID', 'collection.leadID')
      .leftJoin('equated_monthly_installments as emi', 'leads.leadID', 'emi.leadID')
      .leftJoin('call_dispositions as cd', 'loan.loanNo', 'cd.loan_no')
      .leftJoin('whatsapp_dispositions as wd', 'loan.loanNo', 'wd.loan_no')
      .where(function () {
        this.whereIn('leads.status', [
          'Closed',
          'Settlement',
          'Part Payment',
          'Disbursed',
        ]).andWhereRaw('COALESCE(emi.dueDate, approval.repayDate) BETWEEN ? AND ?', [
          startDate,
          endDate,
        ])
      })
      .groupByRaw('COALESCE(emi.dueDate, approval.repayDate)')
      .orderByRaw('`dueDate` DESC')

    return this.serviceResponse(200, result, 'Projection report data retrieved successfully.')
  }

  async projectionFailedFile(fileId: string, type: string): Promise<Readable> {
    try {
      const data = await this.getfailedDetails(fileId, type)
      const templatePath = path.resolve(__dirname, '../views/loansDocs/projection_failed.ejs')
      const htmlContent = await ejs.renderFile(templatePath, { data })
      // console.log('htmlContent', htmlContent)

      // const browser = await puppeteer.launch({
      //   args: [
      //     '--no-sandbox',
      //     '--disable-setuid-sandbox',
      //     '--disable-web-security',
      //   ],
      //   headless: true,
      // })
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
        headless: true,
      })

      const page = await browser.newPage()

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      })

      const pdfBuffer = await page.pdf({ format: 'A4', timeout: 60000 })

      await browser.close()

      const pdfStream = new Readable()
      pdfStream.push(pdfBuffer)
      pdfStream.push(null)

      return pdfStream
    } catch (err) {
      throw err
    }
  }
  private getfailedDetails = async (fileID: string, type: string) => {
    let db = getKnexInstance()
    if (type === 'whatsapp_disposition') {
      const failedData = await db('whatsapp_dispositions')
        .where('fileId', fileID)
        .whereNotNull('failed_reason')
        .orderBy('id', 'desc')
        .select('phone_number', 'failed_reason', 'id')

      const data = failedData.map(row => ({
        row_number: row.id,
        mobile: row.phone_number,
        status: row.failed_reason,
      }))

      return data
    } else if (type === 'call_disposition') {
      // console.log("hi")
      const failedData = await db('call_dispositions')
        .where('fileId', fileID)
        .whereNotNull('failed_reason')
        .orderBy('id', 'desc')
        .select('customer_mobile', 'failed_reason', 'id')
      // console.log("failedData",failedData)

      const data = failedData.map(row => ({
        row_number: row.id,
        mobile: row.customer_mobile,
        status: row.failed_reason,
      }))

      return data
    }
  }

  async projectionFailedFileDetails(page: number, perPage: number) {
    const db = getKnexInstance()

    const offset = (page - 1) * perPage

    const data = await db('projection_filelog').limit(perPage).offset(offset)

    const countResult = await db('projection_filelog').count('* as total')
    const totalCount = countResult[0].total

    const fileData = {
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(+totalCount / perPage),
    }

    return this.serviceResponse(HttpStatusCode.Ok, fileData, 'Success')
  }
}
export const projectionService = new ProjectionService()
