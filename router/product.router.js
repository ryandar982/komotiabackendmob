import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. POST
router.post("/", (req, res) => {
  const { nama_product, deskripsi, price, category, harga, stok, satuan, gambar, id_user, id_category } = req.body;
  const sql = `INSERT INTO products 
    (nama_product, deskripsi, price, category, harga, stok, satuan, gambar, id_user, id_category) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nama_product, deskripsi, price, category, harga, stok, satuan, gambar, id_user, id_category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: "Berhasil menambah produk!", 
      id: result.insertId 
    });
  });
});

// 3. PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nama_product, deskripsi, price, category, harga, stok, satuan, gambar } = req.body;
  const sql = `UPDATE products SET 
    nama_product=?, deskripsi=?, price=?, category=?, harga=?, stok=?, satuan=?, gambar=? 
    WHERE id_product=?`;

  db.query(sql, [nama_product, deskripsi, price, category, harga, stok, satuan, gambar, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: "Produk berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Produk tidak ditemukan" });
    }
  });
});

// 4. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id_product=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Produk dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Produk tidak ditemukan" });
    }
  });
});

export default router;