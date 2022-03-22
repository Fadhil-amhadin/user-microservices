import Postgres from "../connections/connection"
import logger from "../helpers/logger"
import { Request, Response, NextFunction } from "express"

const postgres = new Postgres()
const userTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await postgres.query (`CREATE TABLE IF NOT EXISTS "Users" (id SERIAL PRIMARY KEY, email VARCHAR(255), name VARCHAR(255), "phoneNo" VARCHAR(255), "nationalId" VARCHAR(255), password VARCHAR(255));`)
        logger.info(response)
        next()
    
    } catch (error) {
        logger.error(error)
        next()
    }
}

export default userTable