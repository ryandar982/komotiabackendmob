import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM carts", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. GET BY USER
router.get("/user/:id_user", (req, res) => {
  const { id_user } = req.params;
  db.query("SELECT * FROM carts WHERE id_user=?", [id_user], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Cart tidak ditemukan" });
    res.json(results[0]);
  });
});

// 3. POST
router.post("/", (req, res) => {
  const { id_user } = req.body;

  db.query("INSERT INTO carts (id_user) VALUES (?)", [id_user], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Cart berhasil dibuat!",
      id_cart: result.insertId,
    });
  });
});

// 4. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM carts WHERE id_cart=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Cart dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Cart tidak ditemukan" });
    }
  });
});

export default router;