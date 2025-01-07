import Database from 'better-sqlite3';

export const db = new Database('db.sqlite');

const create_table = "CREATE TABLE IF NOT EXISTS files('path' text, 'data' blob, 'is_gallery_image' boolean, 'is_private' boolean, 'updated_at' datetime, 'created_at' datetime default CURRENT_TIMESTAMP);"
db.exec(create_table);
const create_updated_at = "CREATE TRIGGER IF NOT EXISTS updated_at_trigger AFTER UPDATE ON files FOR EACH ROW when new.updated_at < old.updated_at BEGIN update files set updated_at=CURRENT_TIMESTAMP where path=old.path; end;"
db.exec(create_updated_at)
