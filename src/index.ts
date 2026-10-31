import express, { type Express, type Request, type Response } from 'express';
import path from 'node:path';

const app: Express = express();
const publicDir = path.resolve('public');

// that mean, serve automatically the file in publicDir, that is index.html in default
app.use(express.static(publicDir));
app.use(express.json());


app.get('/test', (req: Request, res: Response) => {
    res.status(200).json({  db: "ok", api: "ok" })
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ health: "ok" })
});

app.listen(3000, '0.0.0.0', (error?: Error) => {
    if (!error)
        console.log("server running on http://localhost:3000");
});