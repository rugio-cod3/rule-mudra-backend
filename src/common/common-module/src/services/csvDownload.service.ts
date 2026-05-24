import { Response } from 'express'
import * as fastCsv from 'fast-csv'
import { Readable } from 'stream'
import { BadRequestError } from '../errors'
import ResponseService from './response.service'

export default class CsvDownloadService extends ResponseService {
  /**
   * A generic function to create formatted CSV files from any data
   * @param data Array of objects to be exported as CSV rows
   * @returns Promise<string> CSV string that can be used to write to response or buffer
   */
  public async generateCsvFile<T extends Record<string, any>>(data: T[]): Promise<string> {
    // If no data, return empty string
    if (!data.length) {
      return ''
    }

    try {
      // Transform data to format dates properly
      const formattedData = data.map(item => {
        const newItem = { ...item }
        for (const key in newItem) {
          if (
            typeof newItem[key] === 'object' &&
            newItem[key] !== null &&
            Object(newItem[key]) instanceof Date
          ) {
            newItem[key] = newItem[key].toISOString().split('T')[0]
          }
        }
        return newItem
      })

      // Use fast-csv to convert data to CSV string
      return new Promise<string>((resolve, reject) => {
        const rows: string[] = []

        fastCsv
          .write(formattedData, { headers: true })
          .on('data', row => rows.push(row.toString()))
          .on('error', error => reject(error))
          .on('end', () => resolve(rows.join('')))
      })
    } catch (error) {
      console.error('Error generating CSV file:', error)
      throw new BadRequestError('Failed to generate CSV file')
    }
  }

  /**
   * Prepares response headers for CSV file download
   * @param res Express Response object
   * @param fileName Name of the file to download (without extension)
   */
  public prepareCsvDownloadHeaders(res: Response, fileName: string): void {
    // Create a consistent filename with timestamp to prevent caching issues
    const date = new Date()
    const formattedDate = date.toISOString().split('T')[0]
    const finalFileName = `${fileName}_${formattedDate}.csv`

    // Properly encode the filename for all browsers
    const encodedFileName = encodeURIComponent(finalFileName)

    // Set comprehensive response headers compatible with various browsers
    res.setHeader('Content-Type', 'text/csv')

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
   * A helper function to use in controllers for quick CSV export
   * Using streams for more efficient memory usage
   * @param res Express Response object
   * @param data Data to export
   * @param fileName Name of the file to download (without extension)
   */
  public async exportDataToCsv<T extends Record<string, any>>(
    res: Response,
    data: T[],
    fileName: string,
  ): Promise<void> {
    try {
      this.prepareCsvDownloadHeaders(res, fileName)

      // Generate CSV content using the existing method
      const csvContent = await this.generateCsvFile(data)

      // Create a readable stream from the CSV string
      const csvStream = Readable.from([csvContent])

      // Pipe the stream directly to the response
      csvStream.pipe(res).on('error', error => {
        console.error('Error streaming CSV:', error)
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to generate CSV file' })
        }
      })
    } catch (error) {
      console.error('Error exporting CSV file:', error)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate CSV file' })
      } else {
        res.end()
      }
    }
  }

  /**
   * A helper function to use in services for quick CSV export
   * @param data Data to export
   * @returns Promise<string> CSV string
   */
  public async exportDataToCsvString<T extends Record<string, any>>(data: T[]): Promise<string> {
    try {
      return this.generateCsvFile(data)
    } catch (error) {
      console.error('Error exporting CSV file:', error)
      throw new BadRequestError('Failed to generate CSV file')
    }
  }
}

export const csvDownloadService = new CsvDownloadService()
