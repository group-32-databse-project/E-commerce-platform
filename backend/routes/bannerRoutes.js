const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// GET /api/banner/toys
router.get('/toys', bannerController.getBannerToys);

// GET /api/banner/electronics
router.get('/electronics', bannerController.getBannerElectronics);

module.exports = router;