import Database from 'better-sqlite3';

export const db = new Database('db.sqlite');

const create_images_table = "CREATE TABLE IF NOT EXISTS images('path' text, 'data' blob );"
db.exec(create_images_table);
const create_files_table = "CREATE TABLE IF NOT EXISTS files('path' text, 'data' blob)";
db.exec(create_files_table);