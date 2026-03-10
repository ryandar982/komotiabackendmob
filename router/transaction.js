import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM transactions", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. GET BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM transactions WHERE id_transaction=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.json(results[0]);
  });
});

// 3. GET BY USER
router.get("/user/:id_user", (req, res) => {
  const { id_user } = req.params;
  db.query("SELECT * FROM transactions WHERE id_user=?", [id_user], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. POST
router.post("/", (req, res) => {
  const { id_user, total_harga, status, alamat_pengiriman, metode_pembayaran } = req.body;

  const sql = `INSERT INTO transactions 
    (id_user, total_harga, status, alamat_pengiriman, metode_pembayaran) 
    VALUES (?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      id_user,
      total_harga,
      status ?? "pending",
      alamat_pengiriman ?? null,
      metode_pembayaran ?? null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Transaksi berhasil dibuat!",
        id_transaction: result.insertId,
      });
    }
  );
});

// 5. PUT (update status & info)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { total_harga, status, alamat_pengiriman, metode_pembayaran } = req.body;

  const sql = `UPDATE transactions SET 
    total_harga=?, status=?, alamat_pengiriman=?, metode_pembayaran=? 
    WHERE id_transaction=?`;

  db.query(
    sql,
    [total_harga, status, alamat_pengiriman, metode_pembayaran, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows > 0) {
        res.json({ message: "Transaksi berhasil diperbarui!" });
      } else {
        res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }
    }
  );
});

// 6. PATCH (update status only)
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "dibayar", "dikirim", "selesai", "dibatalkan"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatus.join(", ")}` });
  }

  db.query(
    "UPDATE transactions SET status=? WHERE id_transaction=?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows > 0) {
        res.json({ message: `Status transaksi berhasil diubah menjadi '${status}'` });
      } else {
        res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }
    }
  );
});

// 7. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transactions WHERE id_transaction=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `Transaksi dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
  });
});

export default router;