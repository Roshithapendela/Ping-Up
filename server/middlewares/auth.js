export const protect = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("Headers:", req.headers.authorization);

    const authResult = await req.auth();
    console.log("Auth result:", authResult);

    const { userId } = authResult;
    console.log("userId:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "Not Authenticated - No userId from Clerk",
      });
    }
    req.userId = userId;
    console.log("✅ Auth successful, userId set to:", req.userId);
    next();
  } catch (error) {
    console.log("❌ Auth error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
