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
        SELECT DISTINCT p.*, c.category_name
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

      const [products] = await db.query(query, params);
      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Filter;