CREATE TABLE websites (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    content TEXT,
    url VARCHAR(765) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_url (url),
    FULLTEXT idx (title, subtitle, content)
);

SELECT id, title, MATCH(title, subtitle, content) 
AGAINST('Doc MYsql' IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AS score 
FROM websites 
WHERE MATCH(title, subtitle, content) 
AGAINST('Doc MYsql' IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)
ORDER BY score DESC;

 SELECT id, title, subtitle, content, MATCH(title, subtitle, content) 
        AGAINST('distributed' IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AS score 
    FROM websites 
    WHERE MATCH(title, subtitle, content) 
        AGAINST('distributed' IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) 
    ORDER BY score DESC
    LIMIT 10 OFFSET 0;

