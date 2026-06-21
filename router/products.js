import { Router } from "express";
import db from "../config/db.js";

const router = Router();


// ==============================
// 1. GET ALL PRODUCTS
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET PRODUCT BY ID
// ==============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM products WHERE id_product=?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. GET PRODUCTS BY CATEGORY
// ==============================
router.get("/category/:id_category", async (req, res) => {
  const { id_category } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM products WHERE id_category=?", [id_category]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. GET PRODUCTS BY SELLER (id_user)
// ==============================
router.get("/seller/:id_user", async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM products WHERE id_user=?", [id_user]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. GET PRODUCT SUMMARY (using v_product_summary view)
// ==============================
router.get("/view/summary", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM v_product_summary");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. POST (ADD PRODUCT)
// Kolom: nama_product, deskripsi, harga, stok, satuan, gambar, id_user, id_category
// (Removed: price, category varchar)
// ==============================
router.post("/", async (req, res) => {
  const { nama_product, deskripsi, harga, stok, satuan, gambar, id_user, id_category } = req.body;

  const sql = `INSERT INTO products 
    (nama_product, deskripsi, harga, stok, satuan, gambar, id_user, id_category) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(sql, [
      nama_product,
      deskripsi ?? null,
      harga,
      stok ?? 0,
      satuan ?? null,
      gambar ?? null,
      id_user,
      id_category
    ]);

    res.status(201).json({
      message: "Berhasil menambah produk!",
      id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 7. PUT (UPDATE PRODUCT)
// Kolom: nama_product, deskripsi, harga, stok, satuan, gambar, id_category
// (Removed: price, category varchar)
// ==============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama_product, deskripsi, harga, stok, satuan, gambar, id_category } = req.body;

  const sql = `UPDATE products SET 
    nama_product=?, deskripsi=?, harga=?, stok=?, satuan=?, gambar=?, id_category=? 
    WHERE id_product=?`;

  try {
    const [result] = await db.query(sql, [
      nama_product,
      deskripsi,
      harga,
      stok,
      satuan,
      gambar,
      id_category,
      id
    ]);

    if (result.affectedRows > 0) {
      res.json({ message: "Produk berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Produk tidak ditemukan" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 8. DELETE PRODUCT
// ==============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM products WHERE id_product=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Produk dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "Produk tidak ditemukan" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;