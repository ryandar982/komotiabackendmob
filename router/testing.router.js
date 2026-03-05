import { Router } from "express";

const router = Router();

// Database sementara di memori
let users = [
  { id: 1, name: "Surti", email: "Surti1987@gmail.com" },
  { id: 2, name: "Tejo", email: "Tedjo1927@gmail.com" },
];

// 1. GET ALL - Mengambil semua user r
router.get("/", (req, res) => {
  res.status(200).json(users);
});

// 2. POST - Menambah user baru c
router.post("/", (req, res) => {
  const { name, email } = req.body;
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json({ message: "User created!", data: newUser });
});

// 3. PUT - Mengupdate data user berdasarkan ID U
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const index = users.findIndex(u => u.id === parseInt(id));

  if (index !== -1) {
    users[index] = { ...users[index], name, email };
    res.json({ message: "User updated successfully", data: users[index] });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// 4. DELETE - Menghapus user 
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = users.length;
  
  users = users.filter(u => u.id !== parseInt(id));

  if (users.length < initialLength) {
    res.json({ message: `User with id ${id} deleted` });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;