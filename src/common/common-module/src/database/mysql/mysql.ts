import { config } from '@/config.server'
import knex, { Knex } from 'knex'
import { logger } from '../../utils/logger'
import { injectBindings } from '../../utils/util'

let primaryDb: Knex = null
let replicaDb: Knex = null

// Create a new Knex connection
async function create(dbConfig): Promise<Knex> {
  const db: Knex = knex({
    client: 'mysql2',
    connection: {
      host: dbConfig.host,
      port: +dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      // timezone: dbConfig.timezone,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
  })

  try {
    await db.raw('SELECT 1')
    return db
  } catch (error) {
    logger.error(error)
    throw new Error(`Unable to connect to MySQL @ ${dbConfig.host}`)
  }
}

// Initialize primary and replica DBs
;(async () => {
  try {
    primaryDb = await create({
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUsername,
      password: config.dbPassword,
      database: config.dbDatabase,
      timezone: config.dbTimeZone,
    })

    replicaDb = await create({
      host: config.dbReplicaHost,
      port: config.dbReplicaPort,
      user: config.dbReplicaUsername,
      password: config.dbReplicaPassword,
      database: config.dbReplicaDatabase,
      timezone: config.dbTimeZone,
    })

    primaryDb.on('query', query => {
      const fullQuery = injectBindings(query.sql, query.bindings)
      logger.info('Primary → ' + fullQuery)
    })

    replicaDb.on('query', query => {
      const fullQuery = injectBindings(query.sql, query.bindings)
      logger.info('Replica → ' + fullQuery)
    })

    logger.info('MySQL connected: primary and replica')
  } catch (error) {
    logger.error(error)
    throw new Error('Unable to connect to MySQL primary/replica via Knex.')
  }
})()

export const runQuery = async (sql: string, values?: any[], onPrimary = true) => {
  const db = onPrimary ? primaryDb : replicaDb
  return values?.length ? await db.raw(sql, values) : await db.raw(sql)
}

// Accessors
export const getKnexInstance = () => primaryDb
export const getReadDb = () => replicaDb
