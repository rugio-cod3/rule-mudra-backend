// app.ts (updated version)
import { config } from '@/config.server'
import { Routes } from '@/interfaces/routes.interface'
import errorMiddleware from '@/middlewares/error.middleware'
import { styledMethod, styledStatus } from '@/utils/chalkStyle'
import { logger, stream } from '@/utils/logger'
import createMongoConnection from '@/utils/mongo'
import rTracer from 'cls-rtracer'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import 'reflect-metadata'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import responseHandler from '@/middlewares/response.middleware'
import { getKnexInstance } from '@/utils/mysql'
import { saveApiLog } from './middlewares/apiLogSave.middleware'
import { validateJson } from './middlewares/invalidJson.middleware'

// Import the main cron service
import CronJobService from './services/cronJobs/cronJobs.service'

class App {
  public app: express.Application
  public env: string
  public port: string | number
  private cronJobService: CronJobService

  constructor(routes: Routes[]) {
    this.app = express()
    this.env = config.nodeEnv
    this.port = config.port

    this.handleUncaughtErrors()
    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    this.initializeErrorHandling()

    this.startCronJobs()
  }

  public async listen() {
    try {
      this.app.listen(this.port, () => {
        logger.info(`=================================`)
        logger.info(`======= ENV: ${this.env} =======`)
        logger.info(`🚀 App listening on the port ${this.port}`)
        logger.info(`=================================`)
      })
    } catch (error) {
      logger.error(error)
    }
  }

  public getServer() {
    return this.app
  }

  public getCronJobService(): CronJobService {
    return this.cronJobService
  }

  private handleUncaughtErrors() {
    process
      .on('unhandledRejection', (reason, p) => {
        console.error(reason, '<======Rejection at Promise', p)
      })
      .on('uncaughtException', err => {
        console.error(err, '<======Uncaught Exception thrown, Shutting Down')
        process.exit(1)
      })
  }

  private connectToDatabase() {
    getKnexInstance()
    createMongoConnection()
  }

  private initializeMiddlewares() {
    this.app.use(
      rTracer.expressMiddleware({
        useHeader: true,
        echoHeader: true,
      }),
    )

    this.morgenSetup()
    this.app.use(cors({ origin: config.origin, credentials: config.credentials }))
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(
      express.json({
        limit: '50mb',
        verify: validateJson,
      }),
    )
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(cookieParser())
    // Custom Response Handlers
    this.app.use(responseHandler)
    this.app.use(saveApiLog)
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router)
    })
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    }

    const specs = swaggerJSDoc(options)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private startCronJobs() {
    console.log("Starting cron jobs...")
    try {
      this.cronJobService = new CronJobService()
      console.log("CronJobService initialized successfully")
      logger.info(`Active schedulers: ${this.cronJobService.getActiveSchedulers().length}`)
    } catch (error) {
      console.error("Error initializing CronJobService:", error)
      logger.error("Failed to initialize cron jobs:", error)
    }
  }

  private morgenSetup() {
    morgan(function (tokens, req, res) {
      return [
        tokens.body(req, res),
        tokens.query(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ')
    })
    morgan.token('reqHeaders', req => {
      const prunedHeaders = { ...req.headers }
      delete prunedHeaders.cookie
      return JSON.stringify(prunedHeaders)
    })
    morgan.token('id', () => (rTracer.id() as string) || '-')
    morgan.token('reqHeaders', (req: any) => JSON.stringify(req.headers))
    morgan.token('resHeaders', (req: any) => JSON.stringify(req.headers))
    morgan.token('method', (req: any) => styledMethod(req.method))
    morgan.token('status', (req: any) => styledStatus(req.statusCode))
    morgan.token('url', (req: any) => req.url)
    morgan.token('response-time', (req: any) => {
      if (!req._startAt || !req._startAt[0]) {
        return ''
      }
      const diff = process.hrtime(req._startAt)
      const ms = diff[0] * 1e3 + diff[1] * 1e-6
      return ms.toFixed(3)
    })
    morgan.token('query', (req: any) => JSON.stringify(req.query))
    morgan.token('body', (req: any) => JSON.stringify(req.body))
    morgan.token('httpVersion', req => JSON.stringify(req.httpVersion))
    morgan.token('startTime', (req: any) => JSON.stringify(req._startTime))
    morgan.token('remoteAddress', (req: any) => JSON.stringify(req._remoteAddress))
    morgan.token('cookie', (req: any) => JSON.stringify(req._cookie))

    this.app.use(
      morgan(
        function (tokens, req, res) {
          return (
            [
              tokens.id(req, res),
              tokens.remoteAddress(req, res),
              tokens.startTime(req, res),
              'HTTP/',
              tokens.httpVersion(req, res),
              styledMethod(tokens.method(req, res)),
              tokens.url(req, res),
              styledStatus(tokens.status(req, res)),
              tokens.res(req, res, 'content-length'),
              '-',
              tokens['response-time'](req, res),
              'ms',
            ].join(' ') +
            ' ' +
            JSON.stringify(
              {
                body: tokens.body(req, res),
                query: tokens.query(req, res),
              },
              null,
              '',
            )
          )
        },
        { stream: stream },
      ),
    )
  }
}

export default App