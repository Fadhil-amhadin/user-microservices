import { Pool } from 'pg'
import logger from '../helpers/logger'
import errorHandler from '../middlewares/errorHandler'

const pool: any = {}

export default class Postgres {
    public async initialize(): Promise<void> {
        const dbUser: string = process.env.DB_USER || 'postgres'
        const dbPass: string = process.env.DB_PASS || 'postgre'

        const config: any = {
            application_name: 'ts-user',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5433',
            database: process.env.DB_DB || 'shopping_mall_xyz_users',
            user: dbUser,
            password: dbPass,
            max: 10,
            idleTimeoutMilis: 5 * 1000
        }
        if (pool.connection === undefined) pool.connection = await new Pool(config)
    }

    async query(text:any) {
        let resultData: any
        const client = await pool.connection.connect()

        try {
            resultData = await client.query(text)
        } catch (error) {
            await client.query('ROLLBACK')
            logger.error(error)
        } finally {
            await client.release()
            return resultData
        }
    }

    async release(): Promise<any> {
        try {
            return pool.client.release()
        } catch (error) {
            logger.error(error)
        }
    }
}