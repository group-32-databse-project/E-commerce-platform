const db = require('../config/database');

class Filter {
  // Retrieve all categories with their subcategories
  static async getCategoriesWithSubcategories() {
    try {
      // Get top-level categories
      const [categories] = await db.query('SELECT * FROM category WHERE parent_category_id IS NULL');

      // For each category, get its subcategories
      const categoriesWithSub = await Promise.all(categories.map(async (category) => {
        const [subcategories] = await db.query('SELECT * FROM category WHERE parent_category_id = ?', [category.category_id]);
        return {
          ...category,
          subcategories,
        };
      }));

      return categoriesWithSub;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve products based on selected categories, subcategories, and price range
  static async getFilteredProducts({ categoryIds = [], subcategoryIds = [], priceRange }) {
    try {
      let query = `
        SELECT p.product_id, p.product_name, p.description, p.product_image, p.weight, c.category_name,
               v.variant_id, v.total_price
        FROM product p
        JOIN category c ON p.category_id = c.category_id
        JOIN variant v ON p.product_id = v.product_id
        WHERE 1=1
      `;
      const params = [];

      // Combine categoryIds and subcategoryIds with OR logic
      if (categoryIds.length > 0 && subcategoryIds.length > 0) {
        query += ` AND (p.category_id IN (${categoryIds.map(() => '?').join(',')}) OR p.category_id IN (${subcategoryIds.map(() => '?').join(',')}))`;
        params.push(...categoryIds, ...subcategoryIds);
      } else if (categoryIds.length > 0) {
        query += ` AND p.category_id IN (${categoryIds.map(() => '?').join(',')})`;
        params.push(...categoryIds);
      } else if (subcategoryIds.length > 0) {
        query += ` AND p.category_id IN (${subcategoryIds.map(() => '?').join(',')})`;
        params.push(...subcategoryIds);
      }

      // Filter by price range based on variant's total_price
      if (priceRange) {
        const { min, max } = priceRange;
        if (min !== undefined) {
          query += ' AND v.total_price >= ?';
          params.push(min);
        }
        if (max !== undefined) {
          query += ' AND v.total_price <= ?';
          params.push(max);
        }
      }

      const [rows] = await db.query(query, params);

      // Map products and aggregate variants
      const productsMap = {};
      rows.forEach(row => {
        const productId = row.product_id;
        if (!productsMap[productId]) {
          productsMap[productId] = {
            product_id: row.product_id,
            product_name: row.product_name,
            description: row.description,
            weight: row.weight,
            product_image: row.product_image,
            category_name: row.category_name,
            variants: [],
            // Add other product fields if necessary
          };
        }
        productsMap[productId].variants.push({
          variant_id: row.variant_id,
          total_price: row.total_price
          // Add other variant fields if necessary
        });
      });

      const products = Object.values(productsMap);
      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Filter;