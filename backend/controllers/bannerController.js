const Banner = require('../models/Banner');

exports.getBannerToys = async (req, res) => {
  try {
    // Parent category ID for Toys
    const toysParentCategoryId = 1; // Update if different
    const products = await Banner.getRandomAvailableProductsByParentCategory(toysParentCategoryId, 3);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error in getBannerToys:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching toys for banner',
      error: error.toString(),
    });
  }
};

exports.getBannerElectronics = async (req, res) => {
  try {
    // Parent category ID for Electronics
    const electronicsParentCategoryId = 2; // Update if different
    const products = await Banner.getRandomAvailableProductsByParentCategory(electronicsParentCategoryId, 3);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error in getBannerElectronics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching electronics for banner',
      error: error.toString(),
    });
  }
};