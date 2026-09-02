import app from "./index";
import connectDB from "./config/database";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    await connectDB();

    console.log("✅ DB ready");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();