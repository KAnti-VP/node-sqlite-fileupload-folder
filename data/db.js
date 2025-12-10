import Database from "better-sqlite3";

const db = new Database("./data/images.sqlite");

db.prepare(
	`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT
    )
  `
).run();

export const saveImageFile = (filename) =>
	db.prepare("INSERT INTO images (filename) VALUES (?)").run(filename);

export const getImages = () => db.prepare("SELECT * FROM images").all()

export const getImageById = (id) => db.prepare("SELECT filename FROM images WHERE id = ?").get(id)

export const deleteImage = (id) => db.prepare("DELETE FROM images WHERE id = ?").run(id)

export default db;
