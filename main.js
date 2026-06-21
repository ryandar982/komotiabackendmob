import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import router
import productRouter from './router/products.js';
import usersRouter from './router/users.js';
import transactionRouter from './router/transaction.js';
import transactionDetailRouter from './router/transaction_details.js';
import paymentsRouter from './router/payments.js';
import reviewsRouter from './router/reviews.js';
import cartsRouter from './router/carts.js';
import cartDetailsRouter from './router/cart_details.js';
import categoriesRouter from './router/categories.js';
import wishlistsRouter from './router/wishlists.js';

const app = express();
const port = process.env.APP_PORT || 3000;


// ==============================
// 🔧 GLOBAL MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());


// ==============================
// 🌐 TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("API berjalan 🚀");
});


// ==============================
// 🔗 ROUTES
// ==============================

// 🔐 Users (Login, Register, Profile)
app.use('/api/users', usersRouter);

// 📦 Products
app.use('/api/products', productRouter);

// 🧾 Transaction
app.use('/api/transactions', transactionRouter);

// 🧾 Transaction Details
app.use('/api/transaction-details', transactionDetailRouter);

// 💳 Payments
app.use('/api/payments', paymentsRouter);

// ⭐ Reviews
app.use('/api/reviews', reviewsRouter);

// 🛒 Cart
app.use('/api/carts', cartsRouter);

// 🛒 Cart Details
app.use('/api/cart-details', cartDetailsRouter);

// 🏷️ Categories
app.use('/api/categories', categoriesRouter);

// ❤️ Wishlists
app.use('/api/wishlists', wishlistsRouter);


// ==============================
// 🚨 HANDLE ROUTE TIDAK DITEMUKAN
// ==============================
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});


// ==============================
// ⚠️ GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});


// ==============================
// 🚀 JALANKAN SERVER
// ==============================
app.listen(port, () => {
  console.log(`🚀 Server running di http://localhost:${port}`);
});