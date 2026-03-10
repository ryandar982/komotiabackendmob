import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. GET BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM categories WHERE id_category=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Category tidak ditemukan" });
    res.json(results[0]);
  });
});

// 3. POST
router.post("/", (req, res) => {
  const { nama_category, deskripsi } = req.body;

  db.query(
    "INSERT INTO categories (nama_category, deskripsi) VALUES (?, ?)",
    [nama_category, deskripsi ?? null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Category berhasil ditambahkan!",
        id_category: result.insertId,
      });
    }
  );
});

// 4. PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nama_category, deskripsi } = req.body;

  db.query(
    "UPDATE categories SET nama_category=?, deskripsi=? WHERE id_category=?",
    [nama_category, deskripsi, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows > 0) {
        res.json({ message: "Category berhasil diperbarui!" });
      } else {
        res.status(404).json({ message: "Category tidak ditemukan" });
      }
    }
  );
});

// 5. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id_category=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Category dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Category tidak ditemukan" });
    }
  });
});

export default router;