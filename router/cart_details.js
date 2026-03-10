import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM cart_details", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. GET BY CART
router.get("/cart/:id_cart", (req, res) => {
  const { id_cart } = req.params;
  db.query("SELECT * FROM cart_details WHERE id_cart=?", [id_cart], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. POST
router.post("/", (req, res) => {
  const { id_cart, id_product, jumlah } = req.body;

  db.query(
    "INSERT INTO cart_details (id_cart, id_product, jumlah) VALUES (?, ?, ?)",
    [id_cart, id_product, jumlah ?? 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Item berhasil ditambahkan ke cart!",
        id_cart_detail: result.insertId,
      });
    }
  );
});

// 4. PUT (update jumlah)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { jumlah } = req.body;

  db.query(
    "UPDATE cart_details SET jumlah=? WHERE id_cart_detail=?",
    [jumlah, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows > 0) {
        res.json({ message: "Jumlah item berhasil diperbarui!" });
      } else {
        res.status(404).json({ message: "Cart detail tidak ditemukan" });
      }
    }
  );
});

// 5. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cart_details WHERE id_cart_detail=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Item dengan id ${id} berhasil dihapus dari cart` });
    } else {
      res.status(404).json({ message: "Cart detail tidak ditemukan" });
    }
  });
});

export default router;