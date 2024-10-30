const Product = require('../models/Product');
const Variant = require('../models/Variant');
const Category = require("../models/Category");
const Variation = require("../models/variation");
const VariationOptions = require("../models/variationOptions");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    for (const product of products) {
      product.variants = await Variant.getVariantsByProductId(
        product.product_id
      );
    }
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.toString() });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);
    if (product) {
      product.variants = await Variant.getVariantsByProductId(
        product.product_id
      );
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

exports.getVariationAndOptions = async (req, res) => {
  try {
    console.log("productId", req.params.id);
    const category = await Category.getCategoryById(req.params.id);

    const variation = await Variation.getVariationByCategoryId(
      category.category_id
    );
    for (const v of variation) {
      v.options = await VariationOptions.getOptionsByVariationId(
        v.variation_id
      );
    }
    res.json(variation);
  } catch (error) {
    console.error("Error in getVariationsAndOptions:", error);
    res.status(500).json({ message: "Error fetching variations and options" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productId = await Product.createProduct(req.body);
    res.status(201).json({ productId });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.toString() });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.getProductsByCategory(req.params.id);
    res.json(products);
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({ message: "Error fetching products by category" });
  }
};

exports.getRecentArrivals = async (req, res) => {
  try {
    const recentVariants = await Variant.getRecentVariants(3);
    res.json(recentVariants);
  } catch (error) {
    console.error('Error in getRecentArrivals:', error);
    res.status(500).json({ message: 'Error fetching recent arrivals' });
  }
};