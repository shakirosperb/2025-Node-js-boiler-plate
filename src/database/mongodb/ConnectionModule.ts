import * as mongoose from 'mongoose'

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
}

require('mongoose').Promise = Promise;
mongoose.set('strictQuery', false);

export default class DBConnection {
    private DBURL: string 
    private conn: any
    private name: string

    constructor(ConnectionString: any) {
        // this.DBURL = ConnectionString;
        this.DBURL = 'mongodb://127.0.0.1:27017/boilerplate';
        this.conn = mongoose.createConnection(this.DBURL, options);
        this.name = 'SHAKIR KALLUNGAL';
    }
    public getConn():mongoose.Connection{
        return this.conn;
    }
    public async initDB() {
        return new Promise((resolve, reject) => {
            if (!this.conn) {
                console.log(this.DBURL)
                this.conn = mongoose.createConnection(this.DBURL, options);
            }
            if (process.env.NODE_ENV === 'development') {
                mongoose.set('debug', false);
            }
            this.conn.on('disconnected', () => {
                mongoose.connect(this.DBURL);
            });
            this.conn.on('error', (err:any) => {
                reject(err);
            });
            this.conn.on('open', () => {
                resolve(this.conn);
            });
            this.conn.once('open', () => {
                console.log(this.DBURL)
                console.log(this.conn.once)
                console.log(this.name)
                console.log("MongoDB connected")
            });
        });
    }
}