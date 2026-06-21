import { Router } from "express";
import db from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();


// ==============================
// 1. GET ALL WISHLISTS
// ==============================
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM wishlists");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. GET WISHLISTS BY USER (with product info)
// ==============================
router.get("/user/:id_user", authMiddleware, async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query(
      `SELECT w.*, p.nama_product, p.harga, p.gambar, p.stok, p.satuan,
              c.nama_category
       FROM wishlists w
       JOIN products p ON w.id_product = p.id_product
       JOIN categories c ON p.id_category = c.id_category
       WHERE w.id_user=?
       ORDER BY w.created_at DESC`,
      [id_user]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. CHECK IF PRODUCT IS IN WISHLIST
// ==============================
router.get("/check/:id_user/:id_product", authMiddleware, async (req, res) => {
  const { id_user, id_product } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM wishlists WHERE id_user=? AND id_product=?",
      [id_user, id_product]
    );

    res.json({
      is_wishlisted: results.length > 0,
      wishlist: results.length > 0 ? results[0] : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. POST (ADD TO WISHLIST)
// Unique constraint: (id_user, id_product)
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  const { id_user, id_product } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO wishlists (id_user, id_product) VALUES (?, ?)",
      [id_user, id_product]
    );

    res.status(201).json({
      message: "Produk berhasil ditambahkan ke wishlist!",
      id_wishlist: result.insertId,
    });
  } catch (err) {
    // Handle duplicate entry
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Produk sudah ada di wishlist!" });
    }
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 5. DELETE FROM WISHLIST BY ID
// ==============================
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM wishlists WHERE id_wishlist=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Produk berhasil dihapus dari wishlist" });
    } else {
      res.status(404).json({ message: "Wishlist tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. DELETE FROM WISHLIST BY USER + PRODUCT (toggle)
// ==============================
router.delete("/user/:id_user/product/:id_product", authMiddleware, async (req, res) => {
  const { id_user, id_product } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM wishlists WHERE id_user=? AND id_product=?",
      [id_user, id_product]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Produk berhasil dihapus dari wishlist" });
    } else {
      res.status(404).json({ message: "Wishlist tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
