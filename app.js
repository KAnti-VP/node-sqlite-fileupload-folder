import express from 'express';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import path from 'path';
import { unlink } from 'fs/promises';
import { fileURLToPath } from 'url';

const app = express();
const dbImg = new sqlite3.Database('./data/images.sqlite');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imageFolder = [__dirname, 'public', 'images'];

// Middleware
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Multer konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/images'),
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`),
});
const upload = multer({ storage });

dbImg.serialize(() => {
  dbImg.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT
    )
  `);
});

app.post('/upload', upload.single('image'), (req, res) => {
  const { filename } = req.file;
  dbImg.run('INSERT INTO images (filename) VALUES (?)', [filename], (err) => {
    if (err) return res.status(500).send('Server error');
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  dbImg.all('SELECT * FROM images', [], (err, rows) => {
    if (err) return res.status(500).send('Server error');
    res.render('index', { images: rows });
  });
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  dbImg.get('SELECT filename FROM images WHERE id = ?', [id], async (err, row) => {
    if (err || !row) return res.status(404).send('Image not found');
    try {
      const filePath = path.join(...imageFolder, row.filename);
      await unlink(filePath);
      dbImg.run('DELETE FROM images WHERE id = ?', [id], () => {
        res.redirect('/');
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.redirect('/');
    }
  });
});

app.listen(3000, () => console.log('Server runs on port http://localhost:3000'));
