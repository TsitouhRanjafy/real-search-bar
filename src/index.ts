import express, { type Express, type Request, type Response } from 'express';
import path from 'node:path';
import mysql from 'mysql2/promise';
import SearchService from './service.js';

const app: Express = express();
const publicDir = path.resolve('public');
const searchService = new SearchService();


// that mean, serve automatically the file in publicDir, that is index.html in default
app.use(express.static(publicDir));
app.use(express.json());


app.get('/test', (req: Request, res: Response) => {
    res.status(200).json({  db: "ok", api: "ok" })
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ health: "ok" })
});


app.post('/search', async (req: Request, res: Response) => {
    try {
        const { query, mode = 'standard' } = req.body;

        if (!query || typeof query !== 'string' || !query.trim()) {
            res.status(400).json({
                error: 'Query is required.'
            });
            return;
        }

        const results = await searchService.run(query.trim(), mode);

        res.status(200).json({
            query: query.trim(),
            mode,
            count: results.length,
            results
        });

    } catch (error) {
        console.error('Search error:', error);

        res.status(500).json({
            error: 'Internal server error.'
        });
    }
});

app.listen(3000, '0.0.0.0', (error?: Error) => {
    if (error) {
        console.error("Error starting server:", error);
        return;
    }


    console.log("server running on http://localhost:3000");
});