import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL CART DETAILS
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM cart_details");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET CART DETAILS BY CART (with product info)
// ==============================
router.get("/cart/:id_cart", async (req, res) => {
  const { id_cart } = req.params;

  try {
    const [results] = await db.query(
      `SELECT cd.*, p.nama_product, p.harga, p.gambar, p.satuan,
              (cd.jumlah * p.harga) AS subtotal
       FROM cart_details cd
       JOIN products p ON cd.id_product = p.id_product
       WHERE cd.id_cart=?`,
      [id_cart]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. POST (ADD ITEM TO CART)
// Unique constraint: (id_cart, id_product) — jika sudah ada, update jumlah
// ==============================
router.post("/", async (req, res) => {
  const { id_cart, id_product, jumlah } = req.body;

  // Gunakan INSERT ... ON DUPLICATE KEY UPDATE agar tidak error saat produk sudah ada di cart
  const sql = `INSERT INTO cart_details (id_cart, id_product, jumlah) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE jumlah = jumlah + VALUES(jumlah)`;

  try {
    const [result] = await db.query(sql, [id_cart, id_product, jumlah ?? 1]);

    res.status(201).json({
      message: "Item berhasil ditambahkan ke cart!",
      id_cart_detail: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. PUT (UPDATE JUMLAH)
// ==============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { jumlah } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE cart_details SET jumlah=? WHERE id_cart_detail=?",
      [jumlah, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Jumlah item berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Cart detail tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. DELETE ITEM FROM CART
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM cart_details WHERE id_cart_detail=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Item dengan id ${id} berhasil dihapus dari cart` });
    } else {
      res.status(404).json({ message: "Cart detail tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;