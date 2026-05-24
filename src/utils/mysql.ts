import config from '@/config/default'
import { logger } from '@/utils/logger'
import knex, { Knex } from 'knex'
import retry from 'retry'
import { injectBindings } from './util'

export async function create() {
  const operation = retry.operation({
    forever: true,
    factor: 2,
    minTimeout: 5000,
    maxTimeout: 10000,
  })

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      const db: Knex = knex({
        client: 'mysql2',
        //connection: config.databaseUrlSql,
        connection: {
          host: config.dbHost,
          port: +config.dbPort,
          user: config.dbUsername,
          password: config.dbPassword,
          database: config.dbDatabase,
          timezone: config.dbTimeZone,
        },
        pool: {
          min: 5,
          max: 20,
        },
        migrations: {
          tableName: 'knex_migrations',
          directory: 'migrations',
        },
        acquireConnectionTimeout: 10000,
      })
      try {
        await db.raw('SELECT now()')
        resolve(db)
      } catch (error) {
        if (operation.retry(error)) {
          logger.warn(`Attempting to re-establish MySQL Database connection`)
          logger.error(`Attempt ${currentAttempt} failed, retrying...`)
        } else {
          logger.error('Failed to connect to database after multiple attempts')
          reject(error)
        }
      }
    })
  })
}
let dbConnection: Knex = null

;(async () => {
  const knexInstance = await create()

  if (knexInstance) {
    dbConnection = knexInstance as Knex<any, any[]>
    dbConnection.on('query', (query) => {
      const fullQuery = injectBindings(query.sql, query.bindings)
      if (!fullQuery.includes('repaydate_holiday')) {
        logger.info('Running Query: ' + fullQuery)
      }
    })

    dbConnection.on('error', (error) => {
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        logger.error('MySQL connection was lost:', error)
        // Optionally, trigger reconnection logic here
      } else {
        logger.error('Unexpected MySQL error:', error)
      }
    })
    logger.info('Mysql connected via knex')
  } else {
    logger.error('Failed to connect to the database after retries')
  }
})()

export const runQuery = async (sql: string, values?: any[]) => {
  const query = dbConnection
  const result =
    values && values.length
      ? await query.raw(sql, values)
      : await query.raw(sql)
  if (query) await query
  return result
}

export const getKnexInstance = () => dbConnection
