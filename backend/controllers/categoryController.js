const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    console.log('getAllCategories categories:', categories);
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error in getAllCategories:', err);
    res.status(500).json({ message: 'Error fetching categories', error: err.toString() });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.getCategoryById(id);
    console.log('getCategoryById category:', category);
    res.status(200).json(category);
  } catch (err) {
    console.error('Error in getCategoryById:', err);
    res.status(500).json({ message: 'Error fetching category', error: err.toString() });
  }
};

exports.getElecs = async (req, res) => {
  console.log('call electronics');
  try {
    const products = await Category.getElecs();
    console.log('getElecs products:', products);
    res.status(200).json(products);
  } catch (err) {
    console.error('Error in getElecs:', err);
    res.status(500).json({ message: 'Error fetching electronics', error: err.toString() });
  }
};

exports.getToys = async (req, res) => {
  console.log('call toys');
  try {
    const products = await Category.getToys();
    console.log('getToys products:', products);
    res.status(200).json(products);
  } catch (err) {
    console.error('Error in getToys:', err);
    res.status(500).json({ message: 'Error fetching toys', error: err.toString() });
  }
};

exports.getToysAndElectronics = async (req, res) => {
  try {
    const products = await Category.getToysAndElectronics();
    console.log('getToysAndElectronics products:', products);
    res.status(200).json(products);
  } catch (err) {
    console.error('Error in getToysAndElectronics:', err);
    res.status(500).json({ message: 'Error fetching toys and electronics', error: err.toString() });
  }
};