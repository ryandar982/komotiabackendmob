import { Router } from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();


// ==============================
// 1. GET ALL USERS (Protected)
// ==============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id_user, nama, email, no_telp, alamat, foto_profil, role, created_at FROM users"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 2. REGISTER USER
// ==============================
router.post("/", async (req, res) => {
  const { nama, email, password, no_telp, alamat, foto_profil, role } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ error: "Nama, email, dan password wajib diisi!" });
  }

  const sql = `
    INSERT INTO users 
    (nama, email, password, no_telp, alamat, foto_profil, role) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [
      nama,
      email,
      password,
      no_telp ?? null,
      alamat ?? null,
      foto_profil ?? null,
      role || "pembeli"
    ]);

    res.status(201).json({
      message: "User berhasil didaftarkan!",
      id: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 3. LOGIN (JWT)
// ==============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password harus diisi!" });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Email atau password salah!" });
    }

    const user = results[0];

    // ⚠️ sementara masih plain text
    if (user.password !== password) {
      return res.status(401).json({ error: "Email atau password salah!" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id_user,
        nama: user.nama,
        email: user.email,
        no_telp: user.no_telp,
        alamat: user.alamat,
        foto_profil: user.foto_profil,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 4. GET PROFILE (Protected)
// ==============================
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Data profile",
    user: req.user
  });
});


// ==============================
// 5. GET USER DASHBOARD (v_user_dashboard view)
// ==============================
router.get("/dashboard/:id_user", authMiddleware, async (req, res) => {
  const { id_user } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM v_user_dashboard WHERE id_user=?",
      [id_user]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6. UPDATE USER (Protected)
// Ditambahkan: foto_profil
// ==============================
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nama, email, password, no_telp, alamat, foto_profil, role } = req.body;

  const sql = `
    UPDATE users SET 
    nama=?, email=?, password=?, no_telp=?, alamat=?, foto_profil=?, role=? 
    WHERE id_user=?
  `;

  try {
    const [result] = await db.query(sql, [
      nama,
      email,
      password,
      no_telp,
      alamat,
      foto_profil ?? null,
      role,
      id
    ]);

    if (result.affectedRows > 0) {
      res.json({ message: "User berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 6a. UPGRADE TO SELLER (Protected)
// ==============================
router.patch("/:id/upgrade-seller", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE users SET role = 'penjual' WHERE id_user = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Berhasil upgrade menjadi penjual!" });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 7. DELETE USER (Protected)
// ==============================
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM users WHERE id_user=?",
      [id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: `User dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
export default router;