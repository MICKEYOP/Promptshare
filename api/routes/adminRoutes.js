const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");

const User = require("../models/accountModel");
const Prompt = require("../models/Prompt");
const AuditLog = require("../models/AuditLog");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* =====================
   👤 USERS
===================== */

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* =====================
   📄 PROMPTS
===================== */

router.get("/prompts", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const prompts = await Prompt.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    res.json(prompts);
  } catch {
    res.status(500).json({ message: "Failed to fetch prompts" });
  }
});

router.delete(
  "/prompts/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const prompt = await Prompt.findById(req.params.id);

      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      await prompt.deleteOne();

      // 📝 AUDIT LOG
      await AuditLog.create({
        admin: req.user.id,
        action: "DELETE_PROMPT",
        targetType: "prompt",
        targetId: req.params.id,
        details: `Prompt "${prompt.title}" deleted`
      });

      res.json({ message: "Prompt deleted by admin" });
    } catch {
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  }
);

/* =====================
   💬 COMMENTS (ADMIN)
===================== */

router.delete(
  "/prompts/:promptId/comments/:commentId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const prompt = await Prompt.findById(req.params.promptId);

      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      prompt.comments = prompt.comments.filter(
        (c) => c._id.toString() !== req.params.commentId
      );

      await prompt.save();

      // 📝 AUDIT LOG
      await AuditLog.create({
        admin: req.user.id,
        action: "DELETE_COMMENT",
        targetType: "comment",
        targetId: req.params.commentId,
        details: `Comment removed from prompt ${req.params.promptId}`
      });

      res.json({ message: "Comment deleted" });
    } catch {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  }
);

/* =====================
   📊 STATS
===================== */

router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalPrompts = await Prompt.countDocuments();

    res.json({ totalUsers, totalAdmins, totalPrompts });
  } catch {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/* =====================
   👑 PROMOTE ADMIN
===================== */

router.put(
  "/make-admin/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      if (req.user.id === req.params.id) {
        return res
          .status(400)
          .json({ message: "You are already admin" });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "admin") {
        return res.status(400).json({ message: "User already admin" });
      }

      user.role = "admin";
      await user.save();

      // 📝 AUDIT LOG
      await AuditLog.create({
        admin: req.user.id,
        action: "PROMOTE_ADMIN",
        targetType: "user",
        targetId: req.params.id,
        details: `User ${user.email} promoted to admin`
      });

      res.json({ message: "User promoted to admin" });
    } catch {
      res.status(500).json({ message: "Failed to promote user" });
    }
  }
);

/* =====================
   📜 AUDIT LOGS (ADMIN)
===================== */

router.get(
  "/audit-logs",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("admin", "email")
        .sort({ createdAt: -1 })
        .limit(100);

      res.json(logs);
    } catch {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  }
);

module.exports = router;

/* =====================
   📤 EXPORT AUDIT LOGS (CSV)
===================== */

router.get(
  "/audit-logs/export",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("admin", "email")
        .sort({ createdAt: -1 });

      // CSV HEADER
      let csv = "Admin Email,Action,Target Type,Target ID,Details,Date\n";

      logs.forEach((log) => {
        csv += `"${log.admin?.email}","${log.action}","${log.targetType}","${log.targetId}","${log.details || ""}","${log.createdAt.toISOString()}"\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=audit_logs.csv"
      );

      res.status(200).send(csv);
    } catch (error) {
      res.status(500).json({ message: "Failed to export audit logs" });
    }
  }
);

/* =====================
   📤 EXPORT AUDIT LOGS (EXCEL)
===================== */

router.get(
  "/audit-logs/export-excel",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("admin", "email")
        .sort({ createdAt: -1 });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Audit Logs");

      // 🧾 Columns
      worksheet.columns = [
        { header: "Admin Email", key: "admin", width: 25 },
        { header: "Action", key: "action", width: 20 },
        { header: "Target Type", key: "targetType", width: 20 },
        { header: "Target ID", key: "targetId", width: 30 },
        { header: "Details", key: "details", width: 40 },
        { header: "Date", key: "date", width: 25 }
      ];

      // 🟨 Header styling
      worksheet.getRow(1).font = { bold: true };

      // 📄 Rows
      logs.forEach((log) => {
        worksheet.addRow({
          admin: log.admin?.email,
          action: log.action,
          targetType: log.targetType,
          targetId: log.targetId,
          details: log.details || "",
          date: log.createdAt.toLocaleString()
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=audit_logs.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ message: "Failed to export Excel file" });
    }
  }
);
