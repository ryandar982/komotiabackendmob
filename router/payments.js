import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM payments");
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
    const [results] = await db.query("SELECT * FROM payments WHERE id_payment=?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Payment tidak ditemukan" });
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
    const [results] = await db.query("SELECT * FROM payments WHERE id_transaction=?", [id_transaction]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. POST
// Kolom: id_transaction, jumlah_bayar, bukti_transfer, status_verifikasi
// catatan_admin hanya bisa diisi saat verifikasi (PATCH)
// ==============================
router.post("/", async (req, res) => {
  const { id_transaction, jumlah_bayar, bukti_transfer, status_verifikasi } = req.body;

  const sql = `INSERT INTO payments 
    (id_transaction, jumlah_bayar, bukti_transfer, status_verifikasi) 
    VALUES (?, ?, ?, ?)`;

  try {
    const [result] = await db.query(sql, [
      id_transaction,
      jumlah_bayar,
      bukti_transfer ?? null,
      status_verifikasi ?? "menunggu"
    ]);

    res.status(201).json({
      message: "Payment berhasil ditambahkan!",
      id_payment: result.insertId,
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
  const { id_transaction, jumlah_bayar, bukti_transfer, status_verifikasi, catatan_admin } = req.body;

  const sql = `UPDATE payments SET 
    id_transaction=?, jumlah_bayar=?, bukti_transfer=?, status_verifikasi=?, catatan_admin=? 
    WHERE id_payment=?`;

  try {
    const [result] = await db.query(sql, [
      id_transaction,
      jumlah_bayar,
      bukti_transfer,
      status_verifikasi,
      catatan_admin ?? null,
      id
    ]);

    if (result.affectedRows > 0) {
      res.json({ message: "Payment berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Payment tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. PATCH (update status verifikasi + catatan admin)
// ==============================
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status_verifikasi, catatan_admin } = req.body;

  const validStatus = ["menunggu", "diterima", "ditolak"];
  if (!validStatus.includes(status_verifikasi)) {
    return res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatus.join(", ")}` });
  }

  try {
    const [result] = await db.query(
      "UPDATE payments SET status_verifikasi=?, catatan_admin=? WHERE id_payment=?",
      [status_verifikasi, catatan_admin ?? null, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: `Status verifikasi berhasil diubah menjadi '${status_verifikasi}'` });
    } else {
      res.status(404).json({ message: "Payment tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 7. DELETE
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM payments WHERE id_payment=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Payment dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Payment tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;