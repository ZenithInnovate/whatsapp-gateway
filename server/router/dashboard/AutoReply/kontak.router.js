import express from "express";
import ControllerKontak from "./kontak.controller.js";

const router = express.Router();
const controller = new ControllerKontak();

// Route untuk membuat kontak
router.post("/create", controller.create.bind(controller));

// Route untuk mengedit kontak
router.post("/edit", controller.edit.bind(controller));

// Route untuk menghapus kontak berdasarkan query params
router.delete("/delete", controller.delete.bind(controller));

// Route untuk menghapus semua kontak
router.delete("/deleteAll", controller.deleteAll.bind(controller));

export default router;
