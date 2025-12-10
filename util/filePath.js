import path from "path";
import __dirname from "./rootpath.js";
import { unlink } from "fs/promises";

const imageFolder = [__dirname, "public", "images"];

export const getFilePath = (filename) => path.join(...imageFolder, filename);

export const deleteFile = async (filePath) => await unlink(filePath);
