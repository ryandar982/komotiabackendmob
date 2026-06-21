import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL CARTS
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM carts");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET ACTIVE CART BY USER
// Hanya ambil cart dengan status 'aktif'
// ==============================
router.get("/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM carts WHERE id_user=? AND status='aktif' ORDER BY created_at DESC LIMIT 1",
      [id_user]
    );
    if (results.length === 0) return res.status(404).json({ message: "Cart aktif tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. GET ALL CARTS BY USER (termasuk yang sudah checkout)
// ==============================
router.get("/user/:id_user/all", async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM carts WHERE id_user=? ORDER BY created_at DESC",
      [id_user]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. POST (CREATE CART)
// Cart baru selalu dibuat dengan status 'aktif'
// ==============================
router.post("/", async (req, res) => {
  const { id_user } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO carts (id_user, status) VALUES (?, 'aktif')",
      [id_user]
    );

    res.status(201).json({
      message: "Cart berhasil dibuat!",
      id_cart: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. PATCH (UPDATE STATUS CART)
// Ubah status dari 'aktif' ke 'checkout'
// ==============================
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["aktif", "checkout"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatus.join(", ")}` });
  }

  try {
    const [result] = await db.query(
      "UPDATE carts SET status=? WHERE id_cart=?",
      [status, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: `Status cart berhasil diubah menjadi '${status}'` });
    } else {
      res.status(404).json({ message: "Cart tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. DELETE CART
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM carts WHERE id_cart=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Cart dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Cart tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;