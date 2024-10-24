-- Drop and delete existing database and tables
DROP DATABASE IF EXISTS SingleVendorECommerce;

-- Create the database
CREATE DATABASE SingleVendorECommerce;

-- Use the new database
USE SingleVendorECommerce;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS `shopping_cart_item`;
DROP TABLE IF EXISTS `order_item`;
DROP TABLE IF EXISTS `customer_address`;
DROP TABLE IF EXISTS `product_specification`;
DROP TABLE IF EXISTS `customer_phone_number`;
DROP TABLE IF EXISTS `payment_method`;
DROP TABLE IF EXISTS `shop_order`;
DROP TABLE IF EXISTS `address`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `variation_option`;
DROP TABLE IF EXISTS `variation`;
DROP TABLE IF EXISTS `customer_payment_method`;
DROP TABLE IF EXISTS `delivery_module`;
DROP TABLE IF EXISTS `variant`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `shopping_cart`;
DROP TABLE IF EXISTS `customer`;

-- Re-create all the tables with indexes
CREATE TABLE `customer` (
  `customer_id` int auto_increment,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email_address` varchar(255),
  `username` varchar(50),
  `password` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`),
  
  -- Indexes
  INDEX idx_email (email_address),
  INDEX idx_username (username),
  INDEX idx_last_login (last_login)
);

CREATE TABLE `shopping_cart` (
  `shopping_cart_id` int auto_increment,
  `customer_id` int,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shopping_cart_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);

CREATE TABLE `category` (
  `category_id` int,
  `category_name` varchar(100),
  `parent_category_id` int,
  `category_image` varchar(255),
  PRIMARY KEY (`category_id`),
  FOREIGN KEY (`parent_category_id`) REFERENCES `category`(`category_id`)
);

CREATE TABLE `product` (
  `product_id` int,
  `category_id` int,
  `product_name` varchar(255),
  `description` text(65535),
  `product_image` varchar(255),
  `weight` decimal(5,1),
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`),
  
  -- Indexes
  INDEX idx_category_id (`category_id`)
);

CREATE TABLE `variant` (
  `variant_id` int,
  `product_id` int,
  `inventory_stock` int,
  `total_price` decimal(7,2),
  `variant_image` varchar(255),
  `SKU` varchar(50),
  PRIMARY KEY (`variant_id`),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`),
  
  -- Indexes
  INDEX idx_product_id (`product_id`)
);

CREATE TABLE `delivery_module` (
  `delivery_module_id` int,
  `estimated_arrival_date` date,
  PRIMARY KEY (`delivery_module_id`)
);

CREATE TABLE `customer_payment_method` (
  `cpm_id` int,
  `customer_id` int,
  `card_number` varchar(20),
  `expiry_date` date,
  PRIMARY KEY (`cpm_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);

CREATE TABLE `variation` (
  `variation_id` int,
  `category_id` int,
  `name` varchar(100),
  PRIMARY KEY (`variation_id`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`)
);

CREATE TABLE `variation_option` (
  `variation_option_id` int,
  `variation_id` int,
  `value` varchar(100),
  PRIMARY KEY (`variation_option_id`),
  FOREIGN KEY (`variation_id`) REFERENCES `variation`(`variation_id`)
);

CREATE TABLE `user` (
  `user_id` int,
  `custemer_id` int,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`custemer_id`) REFERENCES `customer`(`customer_id`)
);

CREATE TABLE `address` (
  `address_id` int,
  `address_line1` varchar(255),
  `address_line2` varchar(255),
  `address_line3` varchar(255),
  `city` varchar(100),
  `region` varchar(100),
  `postal_code` varchar(20),
  `is_main_city` tinyint,
  PRIMARY KEY (`address_id`)
);

CREATE TABLE `payment_method` (
  `payment_method_id` int,
  `name` varchar(200),
  PRIMARY KEY (`payment_method_id`)
);

CREATE TABLE `shop_order` (
  `order_id` int,
  `user_id` int,
  `delivery_module_id` int,
  `order_date` datetime,
  `payment_method_id` int,
  `delivery_method` enum('standard', 'express', 'overnight'),
  `delivery_address_id` int,
  `total_order_price` decimal(10, 2),
  `order_status` enum('pending', 'shipped', 'delivered', 'canceled'),
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
  FOREIGN KEY (`delivery_module_id`) REFERENCES `delivery_module`(`delivery_module_id`),
  FOREIGN KEY (`delivery_address_id`) REFERENCES `address`(`address_id`),
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`payment_method_id`)
);


CREATE TABLE `customer_phone_number` (
  `phone_number` varchar(20),
  `customer_id` int,
  PRIMARY KEY (`phone_number`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);

CREATE TABLE `product_specification` (
  `product_specification_id` int,
  `variant_id` int,
  `variation_option_id` int,
  PRIMARY KEY (`product_specification_id`),
  FOREIGN KEY (`variant_id`) REFERENCES `variant`(`variant_id`),
  FOREIGN KEY (`variation_option_id`) REFERENCES `variation_option`(`variation_option_id`)
);

CREATE TABLE `customer_address` (
  `customer_id` int,
  `address_id` int,
  `is_default` tinyint,
  PRIMARY KEY (`customer_id`, `address_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`),
  FOREIGN KEY (`address_id`) REFERENCES `address`(`address_id`)
);

CREATE TABLE `order_item` (
  `order_item_id` int,
  `order_id` int,
  `variant_id` int,
  `quantity` int,
  `price` decimal(7,2),
  PRIMARY KEY (`order_item_id`),
  FOREIGN KEY (`order_id`) REFERENCES `shop_order`(`order_id`) ON DELETE CASCADE
);

CREATE TABLE `shopping_cart_item` (
  `shopping_cart_item_id` int,
  `shopping_cart_id` int,
  `variant_id` int,
  `quantity` int,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shopping_cart_item_id`),
  FOREIGN KEY (`shopping_cart_id`) REFERENCES `shopping_cart`(`shopping_cart_id`),
  FOREIGN KEY (`variant_id`) REFERENCES `variant`(`variant_id`)
);

CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`order_id`) REFERENCES `shop_order`(`order_id`) ON DELETE CASCADE
);

DELIMITER $$
-- Trigger to Reduce Inventory Stock when an Order is Made
CREATE TRIGGER reduce_inventory_stock
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
  UPDATE variant
  SET inventory_stock = inventory_stock - NEW.quantity
  WHERE variant.variant_id = NEW.variant_id;
END$$

-- Trigger to Update updated_at Timestamp in the shop_order Table
CREATE TRIGGER update_order_timestamp
BEFORE UPDATE ON shop_order
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

-- Trigger to Automatically Create a Shopping Cart when a Customer Registers
CREATE TRIGGER create_shopping_cart
AFTER INSERT ON customer
FOR EACH ROW
BEGIN
  INSERT INTO shopping_cart (customer_id, created_at, updated_at)
  VALUES (NEW.customer_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END$$

-- Trigger to remove items that are going to be checked out from the cart
CREATE TRIGGER remove_cart_item
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
  DELETE FROM shopping_cart_item
  WHERE shopping_cart_id = (SELECT shopping_cart_id FROM shopping_cart WHERE customer_id = (SELECT customer_id FROM user WHERE user_id = (SELECT user_id FROM shop_order WHERE order_id = NEW.order_id)))
    AND variant_id = NEW.variant_id;
END$$

-- Trigger to update the total_order_price when items are added to checkout
CREATE TRIGGER update_total_order_price
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
  -- Calculate the new total order price by summing up the prices of all items in the order
  UPDATE shop_order
  SET total_order_price = (
    SELECT SUM(price * quantity) 
    FROM order_item 
    WHERE order_id = NEW.order_id
  )
  WHERE order_id = NEW.order_id;
END$$


-- Trigger to Ensure Inventory Stock Does Not Fall Below Zero
CREATE TRIGGER check_inventory_stock
BEFORE INSERT ON order_item
FOR EACH ROW
BEGIN
  IF (SELECT inventory_stock FROM variant WHERE variant_id = NEW.variant_id) < NEW.quantity THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Not enough inventory for the requested product.';
  END IF;
END$$


DELIMITER ;

CREATE OR REPLACE VIEW customer_order_report AS
SELECT 
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    COUNT(so.order_id) AS total_orders,
    SUM(so.total_order_price) AS total_spent
FROM 
    customer c
JOIN 
    shop_order so ON c.customer_id = so.user_id
GROUP BY 
    c.customer_id, customer_name;
