import mysql from 'mysql2/promise';

const resultMysqlConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'db_test',
});

if (resultMysqlConnection.state === 'disconnected')
   console.error("Error: MySQL connection is disconnected");

if (resultMysqlConnection.state === 'connected')
    console.log("MySQL connection is connected");


// 1
const sqlSearchStandard = `
    SELECT id, title, subtitle, content, MATCH(title, subtitle, content) 
        AGAINST(? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AS score 
    FROM websites 
    WHERE MATCH(title, subtitle, content) 
        AGAINST(? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) 
    ORDER BY score DESC
    LIMIT 10 OFFSET ?;
`;

// 2
const sqlSearchManual = `
    SELECT id, title, subtitle, content, MATCH(title, subtitle, content) 
        AGAINST(? IN BOOLEAN MODE) AS score 
    FROM websites 
    WHERE MATCH(title, subtitle, content) 
        AGAINST(? IN BOOLEAN MODE) 
    ORDER BY score DESC
    LIMIT 10 OFFSET ?;
`;

// 3
const sqlSearchExact = `
    SELECT id, title, subtitle, content, MATCH(title, subtitle, content) 
        AGAINST(?) AS score 
    FROM websites 
    WHERE MATCH(title, subtitle, content) 
        AGAINST(?) 
    ORDER BY score DESC
    LIMIT 10 OFFSET ?;
`;



export const searchInDatabase = async (query: string, offset: number = 0, mode: SearchMode = 'standard'): Promise<WebsiteSearchResult[]> => {
    try {
        console.log(mysql.format(getSqlQueryForMode(mode), [query, query, offset]));
        const [rows] = await resultMysqlConnection.execute(getSqlQueryForMode(mode), [query, query, offset]);
        return rows as WebsiteSearchResult[];
    } catch (error) {
        console.error("Error executing search query:", error);
        throw error;
    }
};

export interface Website {
    id: number;
    title: string;
    subtitle: string | null;
    content: string | null;
    url: string;
}

export interface WebsiteSearchResult extends Website {
    score: number;
}

export type SearchMode = 'standard' | 'exact' | 'manual';

function getSqlQueryForMode(mode: SearchMode): string {
    switch (mode) {
        case 'standard':
            return sqlSearchStandard;
        case 'exact':
            return sqlSearchExact;
        case 'manual':
            return sqlSearchManual;
        default:
            throw new Error(`Unsupported search mode: ${mode}`);
    }
}
