import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL TRANSACTIONS
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM transactions");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET TRANSACTION BY ID
// ==============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM transactions WHERE id_transaction=?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. GET TRANSACTIONS BY USER
// ==============================
router.get("/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM transactions WHERE id_user=?", [id_user]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. GET TRANSACTION DETAIL VIEW (v_transaction_detail)
// ==============================
router.get("/view/detail", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM v_transaction_detail");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. GET TRANSACTION DETAIL VIEW BY USER
// ==============================
router.get("/view/detail/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM v_transaction_detail WHERE id_user=?", [id_user]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. POST (CREATE TRANSACTION)
// Kolom baru: id_cart, catatan
// ==============================
router.post("/", async (req, res) => {
  const { id_user, id_cart, total_harga, status, alamat_pengiriman, metode_pembayaran, catatan } = req.body;

  const sql = `INSERT INTO transactions 
    (id_user, id_cart, total_harga, status, alamat_pengiriman, metode_pembayaran, catatan) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(sql, [
      id_user,
      id_cart ?? null,
      total_harga,
      status ?? "pending",
      alamat_pengiriman ?? null,
      metode_pembayaran ?? null,
      catatan ?? null
    ]);

    res.status(201).json({
      message: "Transaksi berhasil dibuat!",
      id_transaction: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 7. PUT (UPDATE TRANSACTION)
// ==============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { total_harga, status, alamat_pengiriman, metode_pembayaran, catatan } = req.body;

  const sql = `UPDATE transactions SET 
    total_harga=?, status=?, alamat_pengiriman=?, metode_pembayaran=?, catatan=? 
    WHERE id_transaction=?`;

  try {
    const [result] = await db.query(sql, [
      total_harga,
      status,
      alamat_pengiriman,
      metode_pembayaran,
      catatan ?? null,
      id
    ]);

    if (result.affectedRows > 0) {
      res.json({ message: "Transaksi berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 8. PATCH (UPDATE STATUS ONLY)
// Ditambahkan: status 'dikemas'
// ==============================
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "dibayar", "dikemas", "dikirim", "selesai", "dibatalkan"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatus.join(", ")}` });
  }

  try {
    const [result] = await db.query(
      "UPDATE transactions SET status=? WHERE id_transaction=?",
      [status, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: `Status transaksi berhasil diubah menjadi '${status}'` });
    } else {
      res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 9. DELETE TRANSACTION
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM transactions WHERE id_transaction=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Transaksi dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;