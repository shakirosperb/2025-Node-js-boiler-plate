import 'reflect-metadata';
import 'source-map-support/register'
import dotenv from 'dotenv'
dotenv.config();

import Application from './index'
import cluster, { Worker } from 'cluster'

import os from 'os';

if (cluster.isPrimary) {
    // Get number of CPU core's
    const cores = (process.env.NODE_ENV !== 'production')? 1 : os.cpus().length;
    // Set iteration limiter
    let iteration = (process.env.NODE_ENV !== 'production')? 1 : 0
    // iterate cluster with the number of cpu's
    for (iteration = 0; iteration < cores; iteration++) {
        cluster.fork();
    }

    cluster.on('exit', (worker: Worker, code) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code}`);
        console.log('Fork new worker!');
        cluster.fork();
    });
} else {
    const ApplicationServer =  Application.startServer()
    ApplicationServer.on("error", (error: any) => {
        var bind = typeof process.env.PORT === 'string' ? 'Pipe ' + process.env.PORT : 'Port ' + process.env.PORT;
        if (error.syscall !== 'listen') throw error;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    })

    /**
     * exception handler
     */
    process.on('uncaughtException', function (err) {
        // TODO: add winston
        console.log(err);
        
    });
    process.on("unhandledRejection",(reason:any)=>{
        // TODO: add winston
        console.log(reason);
        throw reason
    })
}
