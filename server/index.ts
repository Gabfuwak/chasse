//Big thanks to
//https://dev.to/jameswallis/how-to-use-socket-io-with-next-js-express-and-typescript-es6-import-instead-of-require-statements-1n0k

import path from 'path';

import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';


const port = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';


const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();


nextApp.prepare().then(async() => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();
    io.attach(server);

    
    io.on('connection', (socket: socketio.Socket) => {
        console.log('>>> client connection');
        
        socket.on('disconnect', () => {
            console.log('>>> client disconnected');
        })
    });
    // Serve static files.
    app.use(express.static(path.join(__dirname, '../src/public')))
    app.use('/_next', express.static(path.join(__dirname, '../.next')))
    
    //Your basic handler
    app.all('*', (req: any, res: any) => nextHandler(req, res));
    

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});