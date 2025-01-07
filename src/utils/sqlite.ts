import Database from 'better-sqlite3';

export const db = new Database('db.sqlite');

// const create_table = "CREATE TABLE IF NOT EXISTS files('path' text, 'data' blob, 'is_gallery_image' boolean default false, 'is_private' boolean default false, 'updated_at' datetime default CURRENT_TIMESTAMP, 'created_at' datetime default CURRENT_TIMESTAMP);"
// db.exec(create_table);
// const create_updated_at = "CREATE TRIGGER IF NOT EXISTS updated_at_trigger AFTER UPDATE ON files FOR EACH ROW when new.updated_at < old.updated_at BEGIN update files set updated_at=CURRENT_TIMESTAMP where path=old.path; end;"
// db.exec(create_updated_at)

const create_image_table = "create table if not exists gallery_images('path' text primary key, 'data' blob, 'created_at' datetime default CURRENT_TIMESTAMP not null, 'updated_at' datetime default CURRENT_TIMESTAMP not null);"
db.exec(create_image_table);
const create_image_update_at_trigger = "create trigger if not exists image_update_at_trigger after update on gallery_images for each row when new.updated_at < old.updated_at begin update gallery_images set updated_at=CURRENT_TIMESTAMP where path=old.path; end;"
db.exec(create_image_update_at_trigger)

export type GALLERY_IMAGE = {
    path: string,
    data: Buffer,
    created_at: Date,
    updated_at: Date
}