import express from "express";
import upload from "./util/multerUpload.js";
import { getFilePath, deleteFile } from "./util/filePath.js";
import * as imgDB from "./data/db.js";

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/upload", upload.single("image"), (req, res) => {
	try {
		const { filename } = req.file;
		imgDB.saveImageFile(filename);
		res.redirect("/");
	} catch (err) {
		res.status(500).send("Server error");
	}
});

app.get("/", (req, res) => {
	try {
		const images = imgDB.getImages();
		res.render("index", { images });
	} catch (err) {
		res.status(500).send("Server error");
	}
});

app.post("/delete/:id", async (req, res) => {
	try {
		const id = +req.params.id;
		const image = imgDB.getImageById(id);
		if (!image) return res.status(404).send("Image not found");
		const filePath = getFilePath(image.filename);
		await deleteFile(filePath);
		imgDB.deleteImage(id);
		res.redirect("/");
	} catch (err) {
		res.status(500).send("Server error: " + err);
	}
});

app.listen(3000, () =>
	console.log("Server runs on port http://localhost:3000")
);
