import express, { type Express, type Request, type Response } from 'express';
import { error } from 'node:console';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000, '0.0.0.0', (error?: Error) => {
    if (!error)
        console.log("server running on http://localhost:3000");
});