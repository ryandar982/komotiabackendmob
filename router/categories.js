import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM categories");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET BY ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("SELECT * FROM categories WHERE id_category=?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Category tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST (Ini yang tadinya bermasalah)
router.post("/", async (req, res) => {
  const { nama_category, deskripsi } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO categories (nama_category, deskripsi) VALUES (?, ?)",
      [nama_category, deskripsi ?? null]
    );
    
    res.status(201).json({
      message: "Category berhasil ditambahkan!",
      id_category: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama_category, deskripsi } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE categories SET nama_category=?, deskripsi=? WHERE id_category=?",
      [nama_category, deskripsi, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: "Category berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Category tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query("DELETE FROM categories WHERE id_category=?", [id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: `Category dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Category tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;