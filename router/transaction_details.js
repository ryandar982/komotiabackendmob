import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM transaction_details");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET BY ID
// ==============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM transaction_details WHERE id_detail=?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Detail tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. GET BY TRANSACTION
// ==============================
router.get("/transaction/:id_transaction", async (req, res) => {
  const { id_transaction } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM transaction_details WHERE id_transaction=?", [id_transaction]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. POST
// Kolom: id_transaction, id_product, jumlah, harga_satuan, subtotal
// ==============================
router.post("/", async (req, res) => {
  console.log(req.body);
  const { id_transaction, id_product, jumlah, harga_satuan, subtotal } = req.body;

  const sql = `INSERT INTO transaction_details 
    (id_transaction, id_product, jumlah, harga_satuan, subtotal) 
    VALUES (?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(sql, [id_transaction, id_product, jumlah, harga_satuan, subtotal]);

    res.status(201).json({
      message: "Detail transaksi berhasil ditambahkan!",
      id_detail: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. PUT
// ==============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_transaction, id_product, jumlah, harga_satuan, subtotal } = req.body;

  const sql = `UPDATE transaction_details SET 
    id_transaction=?, id_product=?, jumlah=?, harga_satuan=?, subtotal=? 
    WHERE id_detail=?`;

  try {
    const [result] = await db.query(sql, [id_transaction, id_product, jumlah, harga_satuan, subtotal, id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Detail transaksi berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Detail tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. DELETE
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM transaction_details WHERE id_detail=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Detail dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Detail tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;