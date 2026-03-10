import { Router } from "express";
import db from "../config/db.js";

const router = Router();    

// 1. GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. POST
router.post("/", (req, res) => {
  const { nama, email, password, no_telp, alamat, role } = req.body;
  const sql = `INSERT INTO users 
    (nama, email, password, no_telp, alamat, role) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nama, email, password, no_telp, alamat, role], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: "Berhasil menambah user!", 
      id: result.insertId 
    });
  });
});

// 3. PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nama, email, password, no_telp, alamat, role } = req.body;
  const sql = `UPDATE users SET 
    nama=?, email=?, password=?, no_telp=?, alamat=?, role=? 
    WHERE id_user=?`;

  db.query(sql, [nama, email, password, no_telp, alamat, role, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: "User berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  });
});

// 4. DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id_user=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: `User dengan id ${id} berhasil dihapus` });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  });
});

export default router;