import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
//import "./models/userModel.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected via Sequelize");

    await sequelize.sync();
    console.log("Database synced successfully!");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
