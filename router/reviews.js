import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM reviews", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. GET BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM reviews WHERE id_review=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Review tidak ditemukan" });
    res.json(results[0]);
  });
});

// 3. GET BY PRODUCT
router.get("/product/:id_product", (req, res) => {
  const { id_product } = req.params;
  db.query("SELECT * FROM reviews WHERE id_product=?", [id_product], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. POST
router.post("/", (req, res) => {
  const { id_user, id_product, rating, komentar } = req.body;

  const sql = `INSERT INTO reviews (id_user, id_product, rating, komentar) VALUES (?, ?, ?, ?)`;

  db.query(sql, [id_user, id_product, rating, komentar ?? null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Review berhasil ditambahkan!",
      id_review: result.insertId,
    });
  });
});

// 5. PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { rating, komentar } = req.body;

  const sql = `UPDATE reviews SET rating=?, komentar=? WHERE id_review=?`;

  db.query(sql, [rating, komentar, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: "Review berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Review tidak ditemukan" });
    }
  });
});

// 6. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM reviews WHERE id_review=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Review dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Review tidak ditemukan" });
    }
  });
});

export default router;