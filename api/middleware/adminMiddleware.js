module.exports = (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, no user found"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only"
      });
    }

    // User is admin → continue
    next();
  } catch (error) {
    res.status(500).json({
      message: "Admin middleware error"
    });
  }
};
