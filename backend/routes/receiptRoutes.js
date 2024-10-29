// receiptUploadHandler.js
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const router = express.Router();

// Multer storage configuration
const storage = multer.memoryStorage();

// File filter for receipts
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    cb(
      new Error(
        "Invalid file type. Only PNG, JPEG, and PDF files are allowed."
      ),
      false
    );
    return;
  }

  if (file.size > maxSize) {
    cb(new Error("File too large. Maximum size is 5MB."), false);
    return;
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware to validate receipt data
const validateReceiptData = (req, res, next) => {
  const requiredFields = ["date", "amount", "category"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // Validate date format
  const date = new Date(req.body.date);
  if (isNaN(date.getTime())) {
    return res.status(400).json({
      error: "Invalid date format",
    });
  }

  // Validate amount
  const amount = parseFloat(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      error: "Invalid amount",
    });
  }

  next();
};

// Upload route with receipt data
router.post(
  "/receipts/upload",
  upload.single("file"),
  validateReceiptData,
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("No file uploaded");
      }

      const receiptData = {
        originalName: req.file.originalname,
        fileData: req.file.buffer, // Store the file buffer directly
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
        metadata: {
          date: new Date(req.body.date),
          amount: parseFloat(req.body.amount),
          category: req.body.category,
          description: req.body.description || "",
          tags: req.body.tags
            ? req.body.tags.split(",").map((tag) => tag.trim())
            : [],
        },
      };

      // Save to database using the Receipt model
      const receipt = new Receipt(receiptData);
      await receipt.save();

      res.status(200).json({
        message: "Receipt uploaded successfully",
        receipt: {
          id: receipt._id,
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
          metadata: receiptData.metadata,
        },
      });
    } catch (error) {
      res.status(400).json({
        error: error.message || "Receipt upload failed",
      });
    }
  }
);

// Get receipts with filtering and pagination
router.get("/receipts", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      category,
      minAmount,
      maxAmount,
      search,
    } = req.query;

    const query = {};

    // Apply filters
    if (startDate || endDate) {
      query["metadata.date"] = {};
      if (startDate) query["metadata.date"].$gte = new Date(startDate);
      if (endDate) query["metadata.date"].$lte = new Date(endDate);
    }

    if (category) {
      query["metadata.category"] = category;
    }

    if (minAmount || maxAmount) {
      query["metadata.amount"] = {};
      if (minAmount) query["metadata.amount"].$gte = parseFloat(minAmount);
      if (maxAmount) query["metadata.amount"].$lte = parseFloat(maxAmount);
    }

    if (search) {
      query.$or = [
        { originalName: new RegExp(search, "i") },
        { "metadata.description": new RegExp(search, "i") },
        { "metadata.tags": new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const receipts = await Receipt.find(query)
      .sort({ "metadata.date": -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Receipt.countDocuments(query);

    res.json({
      receipts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching receipts",
    });
  }
});

// Delete receipt
router.delete("/receipts/:id", async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Delete database record
    await receipt.remove();

    res.json({ message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Error deleting receipt",
    });
  }
});

// Get receipt statistics
router.get("/receipts/stats", async (req, res) => {
  try {
    const stats = await Receipt.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$metadata.date" },
            month: { $month: "$metadata.date" },
            category: "$metadata.category",
          },
          totalAmount: { $sum: "$metadata.amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching receipt statistics",
    });
  }
});

module.exports = router;
