import { IgenerateSoaPayload, ISanctionDataPayload } from '@/interfaces/soa.interface'
import { soaService } from '@/services/soa.service'
import ResponseService from '@/services/response.service'
import { NextFunction, Request, Response } from 'express'

class SoaController extends ResponseService {
  private readonly soaService = soaService

  generateSoaByLeadId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { leadID, data  } = req.body as unknown as IgenerateSoaPayload 
      const payload: IgenerateSoaPayload = {
        leadID, data
      }
      const pdfStream = await soaService.generatePdf(payload);
      res.setHeader('Content-Type', 'application/pdf');
      pdfStream.pipe(res);

    } catch (error) {
      next(error)
    }
  }

  sectionData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { leadID, customerID } = req.body as unknown as ISanctionDataPayload
      const payload: ISanctionDataPayload = { leadID, customerID }
      const { data, message, statusCode } = await this.soaService.sectionData(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  generateSectionPdf = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { leadID, customerID} = req.body as unknown as ISanctionDataPayload 
      const payload: ISanctionDataPayload = { leadID, customerID }
      const pdfStream = await soaService.generateSectionPdf(payload);
      res.setHeader('Content-Type', 'application/pdf');
      pdfStream.pipe(res);

    } catch (error) {
      next(error)
    }
  }

}

export default SoaController
