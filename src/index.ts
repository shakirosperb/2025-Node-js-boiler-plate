import express, { Express } from 'express'
import { createServer } from "http";
import morgan from "morgan"
import ErrorHandler from '@/utils/errorHandler'
import cors from "cors"
import Routes from './routes'
import { MainConnection } from './database/mongodb';
import bodyParser from 'body-parser';
import ip from 'ip'

class Application {
    private app: Express = express()
    private port: number = parseInt(process.env.PORT || "4000")
    private httpServer = createServer(this.app)
    constructor() {
        this.appMiddlewares()
        this.appRoutes()
        this.defaultHandler()
        this.loadDB()
    }

    /**
     * Express Midallwares & other configration ( Cookies, static path ..etc )
     */
    private appMiddlewares(): void {
        this.app.use(bodyParser.json({ limit: '2mb' }))
        this.app.use(express.json({ limit: '2mb' }))
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(morgan("dev"))
        this.app.use(cors({
            origin: "*",
            methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            allowedHeaders: 'X-Requested-With, X-Forwarded-For, content-type, Authorization',
            credentials: true
        }))
        this.app.use(ErrorHandler.timeOut)
    }
    /**
   * init app routes
   */
    private appRoutes(): void {
        Routes(this.app)
    }
    /**
     * default error handler
     */
    private defaultHandler() {
        this.app.use(ErrorHandler.notFound404)
        this.app.use(ErrorHandler.errHandler)
    }
    /**
     * load DB
     */
    private async  loadDB() {
        // redis1.connect()
        await MainConnection.initDB()
    }

    /**
     * Initialize Server startup
     */
    public startServer(): Express {
        this.httpServer.listen(this.port, () => {
            console.log(`🚀 App listening on the port ${ip.address()}:${this.port}`);
            // console.log(`http://localhost:${this.port}`);
        })
        return this.app
    }
}

export default new Application()