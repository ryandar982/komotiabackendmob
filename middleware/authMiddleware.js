import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  console.log("Isi Headers yang masuk:", req.headers); 

  const authHeader = req.headers.authorization;

  if (!authHeader) {
      console.log("Masuk sini karena authHeader kosong!");
      return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};