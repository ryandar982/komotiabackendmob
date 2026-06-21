import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL REVIEWS
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM reviews");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET REVIEW BY ID
// ==============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM reviews WHERE id_review=?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Review tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. GET REVIEWS BY PRODUCT
// ==============================
router.get("/product/:id_product", async (req, res) => {
  const { id_product } = req.params;

  try {
    const [results] = await db.query(
      `SELECT r.*, u.nama AS nama_user 
       FROM reviews r 
       JOIN users u ON r.id_user = u.id_user 
       WHERE r.id_product=?`,
      [id_product]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. GET REVIEWS BY USER
// ==============================
router.get("/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query(
      `SELECT r.*, p.nama_product 
       FROM reviews r 
       JOIN products p ON r.id_product = p.id_product 
       WHERE r.id_user=?`,
      [id_user]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. POST (CREATE REVIEW)
// Kolom baru: id_transaction (memastikan user benar-benar membeli)
// ==============================
router.post("/", async (req, res) => {
  const { id_user, id_product, id_transaction, rating, komentar } = req.body;

  const sql = `INSERT INTO reviews 
    (id_user, id_product, id_transaction, rating, komentar) 
    VALUES (?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(sql, [
      id_user,
      id_product,
      id_transaction ?? null,
      rating,
      komentar ?? null
    ]);

    res.status(201).json({
      message: "Review berhasil ditambahkan!",
      id_review: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. PUT (UPDATE REVIEW)
// ==============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, komentar } = req.body;

  const sql = `UPDATE reviews SET rating=?, komentar=? WHERE id_review=?`;

  try {
    const [result] = await db.query(sql, [rating, komentar, id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Review berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Review tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 7. DELETE REVIEW
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM reviews WHERE id_review=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Review dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Review tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;