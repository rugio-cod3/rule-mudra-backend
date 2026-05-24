import ExcelJS from 'exceljs'
import { Response } from 'express'
import moment from 'moment-timezone'
import { BadRequestError } from '../errors'
import ResponseService from './response.service'

export default class ExcelDownloadService extends ResponseService {
  /**
   * A generic function to create formatted Excel files from any data
   * @param data Array of objects to be exported as Excel rows
   * @param worksheetName Optional name for the worksheet (defaults to 'Data')
   * @param customColumns Optional custom column definitions
   * @returns ExcelJS.Workbook instance that can be used to write to response or buffer
   */
  public generateExcelFile<T extends Record<string, any>>(
    data: T[],
    worksheetName: string = 'Data',
    customColumns?: Partial<ExcelJS.Column>[],
  ): ExcelJS.Workbook {
    // Create a new workbook with metadata
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'CRM System'
    workbook.lastModifiedBy = 'CRM System'
    workbook.created = new Date()
    workbook.modified = new Date()
    workbook.properties.date1904 = true

    // Add worksheet with page setup
    const worksheet = workbook.addWorksheet(worksheetName, {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    })

    // If no data, return empty workbook
    if (!data.length) {
      return workbook
    }

    // Define columns based on first data item's keys or use custom columns if provided
    const columns =
      customColumns ||
      Object.keys(data[0]).map(key => ({
        header: key
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Only add space between lowercase and uppercase
          .replace(/^./, str => str.toUpperCase())
          .trim(),
        key,
        width: Math.max(15, Math.min(30, key.length * 1.5)),
      }))

    // Set columns to worksheet
    worksheet.columns = columns

    // Style the header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, size: 12 }
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    }
    headerRow.height = 22

    // Add data rows
    worksheet.addRows(data)

    // Pre-calculate header lengths and initialize column widths
    const minWidth = 15
    const maxWidth = 30
    const padding = 5

    worksheet.columns.forEach(col => {
      // Set initial width based on header
      const headerLength = col.header?.length ?? 0
      let optimalWidth = Math.max(minWidth, Math.min(maxWidth, headerLength + padding))

      // Find longest cell value in one pass
      if (col.eachCell) {
        col.eachCell({ includeEmpty: false }, cell => {
          if (cell.value) {
            const cellLength = cell.value.toString().length
            optimalWidth = Math.max(optimalWidth, Math.min(maxWidth, cellLength + padding))
          }
        })
      }

      col.width = optimalWidth
      col.alignment = { horizontal: 'center', vertical: 'middle' }
    })

    // Style data rows for better readability
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Apply formatting to all data rows
        row.alignment = { vertical: 'middle', horizontal: 'left' }
        row.height = 20

        // Add cell borders and alternate row shading for better readability
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }

          // Format dates automatically
          if (cell.value instanceof Date) {
            cell.numFmt = 'dd/mm/yyyy hh:mm:ss'
          }
        })

        // Add alternate row shading
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' },
          }
        }
      }
    })

    // Add auto-filter for easy data sorting in Excel
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length },
    }

    // Freeze the header row so it stays visible when scrolling
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]

    return workbook
  }

  /**
   * Prepares response headers for Excel file download
   * @param res Express Response object
   * @param fileName Name of the file to download (without extension)
   */
  public prepareExcelDownloadHeaders(res: Response, fileName: string): void {
    // Create a consistent filename with timestamp to prevent caching issues
    const date = moment().tz('Asia/Kolkata')
    const formattedDate = date.format('YYYYMMDD_HHmmss')
    const finalFileName = `${fileName}_${formattedDate}.xlsx`

    // Properly encode the filename for all browsers
    const encodedFileName = encodeURIComponent(finalFileName)

    // Set comprehensive response headers compatible with various browsers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    // Support multiple browser filename specifications
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${finalFileName}"; filename*=UTF-8''${encodedFileName}`,
    )

    // Ensure Content-Disposition is exposed for CORS requests
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type')

    // Prevent any caching of the file
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }

  /**
   * Prepares response headers for Txt file download
   * @param res Express Response object
   * @param fileName Name of the file to download (without extension)
   */
  public prepareTxtDownloadHeaders(res: Response, fileName: string): void {
    // Create a consistent filename with timestamp to prevent caching issues
    const date = moment().tz('Asia/Kolkata')
    const formattedDate = date.format('YYYYMMDD_HHmmss')
    const finalFileName = `${fileName}_${formattedDate}.txt`

    // Properly encode the filename for all browsers
    const encodedFileName = encodeURIComponent(finalFileName)

    // Set comprehensive response headers compatible with various browsers
    res.setHeader('Content-Type', 'text/plain')

    // Support multiple browser filename specifications
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${finalFileName}"; filename*=UTF-8''${encodedFileName}`,
    )

    // Ensure Content-Disposition is exposed for CORS requests
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type')

    // Prevent any caching of the file
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }

  /**
   * A helper function to use in controllers for quick Excel export
   * @param res Express Response object
   * @param data Data to export
   * @param fileName Name of the file to download (without extension)
   * @param worksheetName Optional name for the worksheet
   * @param customColumns Optional custom column definitions
   */
  public async exportDataToExcel<T extends Record<string, any>>(
    res: Response,
    data: T[],
    fileName: string,
    worksheetName: string = 'Sheet1',
    customColumns?: Partial<ExcelJS.Column>[],
  ): Promise<void> {
    try {
      const workbook = this.generateExcelFile(data, worksheetName, customColumns)
      this.prepareExcelDownloadHeaders(res, fileName)

      // Write workbook directly to response stream
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('Error exporting Excel file:', error)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate Excel file' })
      } else {
        res.end()
      }
    }
  }

  /**
   * A helper function to use in services for quick Excel export
   * @param data Data to export
   * @param worksheetName Optional name for the worksheet
   * @param customColumns Optional custom column definitions
   */
  public async exportDataToExcelBuffer<T extends Record<string, any>>(
    data: T[],
    worksheetName: string = 'Sheet1',
    customColumns?: Partial<ExcelJS.Column>[],
  ): Promise<ExcelJS.Workbook> {
    try {
      const workbook = this.generateExcelFile(data, worksheetName, customColumns)
      return workbook
    } catch (error) {
      console.error('Error exporting Excel file:', error)
      throw new BadRequestError('Failed to generate Excel file')
    }
  }

  public async excelDownloadForDateWiseCollection(data) {
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Data')

      // Define columns with sub-columns
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Dues - Cases', key: 'dues_cases', width: 15 },
        { header: 'Dues - Loan Amount', key: 'dues_loanAmount', width: 15 },
        { header: 'Dues - Interest Amount', key: 'dues_interestAmount', width: 15 },
        { header: 'Dues - Repayment Amount', key: 'dues_repaymentAmount', width: 15 },
        { header: 'Dues - Percentage', key: 'dues_percentage', width: 15 },

        { header: 'Collection - Cases', key: 'collected_cases', width: 15 },
        { header: 'Collection - Loan Amount', key: 'collected_loanAmount', width: 15 },
        { header: 'Collection - Interest Amount', key: 'collected_interestAmount', width: 15 },
        { header: 'Collection - Collected Amount', key: 'collected_collectedAmount', width: 15 },
        { header: 'Collection - Penalty Amount', key: 'collected_penaltyAmount', width: 15 },
        { header: 'Collection - Percentage', key: 'collected_percentage', width: 15 },

        { header: 'Pending - Cases', key: 'pending_cases', width: 15 },
        { header: 'Pending - Loan Amount', key: 'pending_loanAmount', width: 15 },
        { header: 'Pending - Interest Amount', key: 'pending_interestAmount', width: 15 },
        { header: 'Pending - Part Payment', key: 'pending_partPayment', width: 15 },
        { header: 'Pending - Pending Amount', key: 'pending_pendingAmount', width: 15 },
        { header: 'Pending - Percentage', key: 'pending_percentage', width: 15 },
      ]

      // Prepare data rows
      const rows = data.result.map(item => ({
        date: item.date,
        dues_cases: item.due.cases,
        dues_loanAmount: item.due.loanAmount,
        dues_interestAmount: item.due.interestAmount,
        dues_repaymentAmount: item.due.repaymentAmount,
        dues_percentage: item.due.percentage,

        collected_cases: item.collected.cases,
        collected_loanAmount: item.collected.loanAmount,
        collected_interestAmount: item.collected.interestAmount,
        collected_collectedAmount: item.collected.collectedAmount,
        collected_penaltyAmount: item.collected.penaltyAmount,
        collected_percentage: item.collected.percentage,

        pending_cases: item.pending.cases,
        pending_loanAmount: item.pending.loanAmount,
        pending_interestAmount: item.pending.interestAmount,
        pending_partPayment: item.pending.partPaymentAmount,
        pending_pendingAmount: item.pending.pending_amount,
        pending_percentage: item.pending.percentage,
      }))

      // Add data rows to worksheet
      rows.forEach(row => {
        worksheet.addRow(row)
      })

      // Calculate totals for all fields
      const totals = {
        date: 'Total',
        dues_cases: rows.reduce((sum, row) => sum + (row.dues_cases || 0), 0),
        dues_loanAmount: rows.reduce((sum, row) => sum + (row.dues_loanAmount || 0), 0),
        dues_interestAmount: rows.reduce((sum, row) => sum + (row.dues_interestAmount || 0), 0),
        dues_repaymentAmount: rows.reduce((sum, row) => sum + (row.dues_repaymentAmount || 0), 0),
        dues_percentage: rows.reduce((sum, row) => sum + (row.dues_percentage || 0), 0),

        collected_cases: rows.reduce((sum, row) => sum + (row.collected_cases || 0), 0),
        collected_loanAmount: rows.reduce((sum, row) => sum + (row.collected_loanAmount || 0), 0),
        collected_interestAmount: rows.reduce(
          (sum, row) => sum + (row.collected_interestAmount || 0),
          0,
        ),
        collected_collectedAmount: rows.reduce(
          (sum, row) => sum + (row.collected_collectedAmount || 0),
          0,
        ),
        collected_penaltyAmount: rows.reduce((sum, row) => sum + (row.penalityAmount || 0), 0),
        collected_percentage: rows.reduce((sum, row) => sum + (row.collected_percentage || 0), 0),
        pending_cases: rows.reduce((sum, row) => sum + (row.pending_cases || 0), 0),
        pending_loanAmount: rows.reduce((sum, row) => sum + (row.pending_loanAmount || 0), 0),
        pending_interestAmount: rows.reduce(
          (sum, row) => sum + (row.pending_interestAmount || 0),
          0,
        ),
        pending_partPayment: rows.reduce((sum, row) => sum + (row.pending_partPayment || 0), 0),
        pending_pendingAmount: rows.reduce((sum, row) => sum + (row.pending_pendingAmount || 0), 0),
        pending_percentage: rows.reduce((sum, row) => sum + (row.pending_percentage || 0), 0),
      }

      // Add the totals row at the end
      worksheet.addRow(totals)

      // Write the buffer and return it
      const buffer = await workbook.xlsx.writeBuffer()
      return buffer
    } catch (error) {
      console.error('Excel generation error:', error)
      throw new Error('Error generating Excel file')
    }
  }
}

export const excelDownloadService = new ExcelDownloadService()
