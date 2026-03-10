import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM transaction_details", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. GET BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM transaction_details WHERE id_detail=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Detail tidak ditemukan" });
    res.json(results[0]);
  });
});

// 3. GET BY TRANSACTION
router.get("/transaction/:id_transaction", (req, res) => {
  const { id_transaction } = req.params;
  db.query("SELECT * FROM transaction_details WHERE id_transaction=?", [id_transaction], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. POST
router.post("/", (req, res) => {
    console.log(req.body);
  const { id_transaction, id_product, jumlah, harga_satuan, subtotal } = req.body;
  const sql = `INSERT INTO transaction_details 
    (id_transaction, id_product, jumlah, harga_satuan, subtotal) 
    VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [id_transaction, id_product, jumlah, harga_satuan, subtotal], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Detail transaksi berhasil ditambahkan!",
      id_detail: result.insertId,
    });
  });
});

// 5. PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_transaction, id_product, jumlah, harga_satuan, subtotal } = req.body;
  const sql = `UPDATE transaction_details SET 
    id_transaction=?, id_product=?, jumlah=?, harga_satuan=?, subtotal=? 
    WHERE id_detail=?`;

  db.query(sql, [id_transaction, id_product, jumlah, harga_satuan, subtotal, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: "Detail transaksi berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Detail tidak ditemukan" });
    }
  });
});

// 6. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transaction_details WHERE id_detail=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Detail dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Detail tidak ditemukan" });
    }
  });
});

export default router;