// Alternative entry point for cPanel
// Some cPanel setups prefer server.js over index.js
import app from "./index.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📍 MongoDB: ${process.env.MONGO_URI ? "Connected" : "Not configured"}`,
  );
});
