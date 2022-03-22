import express from 'express'
import cors from 'cors'
import router from './routes'
import Postgres from './connections/connection'
import userTable from './models/users'

class App {
    app: any
    postgres: any

    constructor() {
        this.app = express()
        this.postgres = new Postgres()
        this.config()
    }

    async config(): Promise<void> {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))
        await this.postgres.initialize()
        this.app.use('/', userTable)
        this.app.use('/', router)
    }
}

export default new App().app