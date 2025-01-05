import Database from 'better-sqlite3';

export const db = new Database('db.sqlite');

const create_table = "CREATE TABLE IF NOT EXISTS files('path' text, 'data' blob, 'type' text );"
db.exec(create_table);