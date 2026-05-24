// import CommonHelper from '@/helpers/common'
// import { NextFunction, Request, Response } from 'express'
// import multer, { MulterError } from 'multer'

// export interface IAuthenticatedRequest extends Request {
//   customer: any
// }

// class Multer {
//   private commonHelper = new CommonHelper()
//   private storage = multer.memoryStorage()

//   private upload = multer({
//     storage: this.storage,
//     limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
//   }).single('image')

//   public SingleUpload = async (
//     req: IAuthenticatedRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     this.upload(req, res, (err: any) => {
//       if (err instanceof MulterError) {
//         return this.commonHelper.sendResponse(res, false, err.message, {}, 400)
//       } else if (err) {
//         this.commonHelper.sendResponse(res, true, err.message, {}, 400)
//       } else {
//         // Everything went fine, proceed to the next middleware or route handler
//         next()
//       }
//     })
//   }
// }

// export default Multer




import CommonHelper from '@/helpers/common'
import { NextFunction, Request, Response } from 'express'
import multer, { MulterError } from 'multer'

export interface IAuthenticatedRequest extends Request {
  customer: any
}

class Multer {
  private commonHelper = new CommonHelper()
  private storage = multer.memoryStorage()
  private upload = multer({
    storage: this.storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB file size limit
      files: 1 // Only allow single file
    },
    fileFilter: (req, file, cb) => {
      // Validate file type
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
      }
    }
  }).single('image')

  public SingleUpload = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    this.upload(req, res, (err: any) => {
      if (err instanceof MulterError) {
        let message = 'File upload error';
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'File size too large. Maximum 5MB allowed.';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected file field. Use "image" field name.';
            break;
          default:
            message = err.message;
        }
        return this.commonHelper.sendResponse(res, false, message, {}, 400)
      } else if (err) {
        return this.commonHelper.sendResponse(res, false, err.message, {}, 400)
      } else {
        next()
      }
    })
  }
}

export default Multer