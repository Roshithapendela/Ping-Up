import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import storyRouter from "./routes/storyRouter.js";
import messageRouter from "./routes/messageRouter.js";

const app = express();

try {
  connectDB();
} catch (error) {
  console.error("DB connection failed:", error);
}

app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is Running..." });
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server Running on the port ${PORT}`);
  });
}

export default app;
