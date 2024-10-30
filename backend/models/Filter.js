const db = require('../config/database');

class Filter {
  
  /**
   * Retrieve all categories with their subcategories using stored procedure.
   * @returns {Promise<Array>} - An array of categories with their subcategories.
   */
  static async getCategoriesWithSubcategories() {
    try {
      const [rows] = await db.query('CALL get_categories_with_subcategories()');

      // Process the result to group subcategories under their respective categories
      const categoriesMap = {};

      rows[0].forEach(row => {
        const { category_id, category_name, subcategory_id, subcategory_name } = row;
        
        if (!categoriesMap[category_id]) {
          categoriesMap[category_id] = {
            category_id,
            category_name,
            subcategories: []
          };
        }

        if (subcategory_id) {
          categoriesMap[category_id].subcategories.push({
            category_id: subcategory_id,
            category_name: subcategory_name
          });
        }
      });

      return Object.values(categoriesMap);
    } catch (error) {
      console.error('Error retrieving categories with subcategories:', error);
      throw error;
    }
  }

  /**
   * Retrieve products based on selected categories, subcategories, and price range using stored procedure.
   * @param {Object} params - Filter parameters.
   * @param {Array} params.categoryIds - Array of category IDs.
   * @param {Array} params.subcategoryIds - Array of subcategory IDs.
   * @param {Object} params.priceRange - Price range with 'min' and 'max'.
   * @returns {Promise<Array>} - An array of filtered products.
   */
  static async getFilteredProducts({ categoryIds = [], subcategoryIds = [], priceRange }) {
    try {
      // Convert arrays to comma-separated strings for SQL IN clause
      const categoryIdsStr = categoryIds.join(',');
      const subcategoryIdsStr = subcategoryIds.join(',');

      const minPrice = priceRange?.min;
      const maxPrice = priceRange?.max;

      const [rows] = await db.query('CALL get_filtered_products(?, ?, ?, ?)', [
        categoryIdsStr,
        subcategoryIdsStr,
        minPrice,
        maxPrice
      ]);

      // Process the result to map variants to products
      const productsMap = {};

      rows[0].forEach(row => {
        const { product_id, product_name, description, product_image, weight, category_name, variant_id, total_price } = row;

        if (!productsMap[product_id]) {
          productsMap[product_id] = {
            product_id,
            product_name,
            description,
            product_image,
            weight,
            category_name,
            variants: []
          };
        }

        productsMap[product_id].variants.push({
          variant_id,
          total_price
        });
      });

      const products = Object.values(productsMap);
      return products;
    } catch (error) {
      console.error('Error retrieving filtered products:', error);
      throw error;
    }
  }
}

module.exports = Filter;