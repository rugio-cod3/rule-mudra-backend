import winston from 'winston'

const serviceName = process.env.SERVICE_NAME || 'my-service'
const environment = process.env.NODE_ENV || 'development'

const logger = winston.createLogger({
  level: environment === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: serviceName,
    env: environment,
  },
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
})

const stream = {
  write: (message: string) => {
    logger.info(message.trim())
  },
}

export { logger, stream }
