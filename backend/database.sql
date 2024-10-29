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

-- Create the notifications table
CREATE TABLE `notifications` (
  `notification_id` INT AUTO_INCREMENT,
  `order_id` INT,
  `message` VARCHAR(255),
  `is_read` TINYINT DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  FOREIGN KEY (`order_id`) REFERENCES `shop_order`(`order_id`) ON DELETE CASCADE
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

-- Trigger to insert a notification when a new order is placed
CREATE TRIGGER notify_order_created
AFTER INSERT ON shop_order
FOR EACH ROW
BEGIN
  INSERT INTO notifications (order_id, message)
  VALUES (NEW.order_id, CONCAT('Your order #', NEW.order_id, ' has been placed successfully.'));
END$$

-- Trigger to insert a notification when an order's status is updated
CREATE TRIGGER notify_order_status_updated
AFTER UPDATE ON shop_order
FOR EACH ROW
BEGIN
  IF OLD.order_status <> NEW.order_status THEN
    INSERT INTO notifications (order_id, message)
    VALUES (NEW.order_id, CONCAT('Your order #', NEW.order_id, ' status has been updated to ', NEW.order_status, '.'));
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




-- Inserting records

-- Customer table
INSERT INTO customer (first_name, last_name, email_address, username, password) VALUES
('John', 'Doe', 'john.doe@email.com', 'johnd', 'password123'),
('Jane', 'Smith', 'jane.smith@email.com', 'janes', 'securepass'),
('Robert', 'Johnson', 'robert.j@email.com', 'robertj', 'texasbest'),
('Emily', 'Brown', 'emily.b@email.com', 'emilyb', 'toysrus'),
('Michael', 'Davis', 'michael.d@email.com', 'michaeld', 'electronics101'),
('Sarah', 'Wilson', 'sarah.w@email.com', 'sarahw', 'shopaholic'),
('David', 'Martinez', 'david.m@email.com', 'davidm', 'password321'),
('Jennifer', 'Anderson', 'jennifer.a@email.com', 'jennifera', 'texasshopper'),
('William', 'Taylor', 'william.t@email.com', 'williamt', 'toyslover'),
('Elizabeth', 'Thomas', 'elizabeth.t@email.com', 'elizabetht', 'gadgetfan');

-- Category table
INSERT INTO category (category_id, category_name, parent_category_id, category_image) VALUES
(1, 'Toys', NULL, 'toys.jpg'),
(2, 'Electronics', NULL, 'electronics.jpg'),
(3, 'Action Figures', 1, 'action_figures.jpg'),
(4, 'Board Games', 1, 'board_games.jpg'),
(5, 'Smartphones', 2, 'smartphones.jpg'),
(6, 'Laptops', 2, 'laptops.jpg'),
(7, 'Educational Toys', 1, 'educational_toys.jpg'),
(8, 'Outdoor Toys', 1, 'outdoor_toys.jpg'),
(9, 'Gaming Consoles', 2, 'gaming_consoles.jpg'),
(10, 'Smart Home Devices', 2, 'smart_home.jpg');

-- Product table
INSERT INTO product (product_id, category_id, product_name, description, product_image, weight) VALUES
(1, 3, 'Superhero Action Figure', 'Poseable superhero figure', 'https://media.istockphoto.com/id/458945985/photo/partners-against-crime.jpg?s=612x612&w=0&k=20&c=r6A4YzG_TAyGF2jGoJSwY6PizSqC9BcIi_PSQBfq5CA=', 0.3),
(2, 4, 'Strategy Board Game', 'Complex strategy game for adults', 'https://www.shutterstock.com/image-vector/isometric-board-games-various-boardgames-600nw-2322698469.jpg', 1.2),
(3, 5, 'TexasPhone X', 'Latest smartphone with advanced features', 'https://www.shutterstock.com/image-illustration/3d-mobile-phone-sim-card-260nw-1880249659.jpg', 0.18),
(4, 6, 'LoneStar Laptop', 'Powerful laptop for work and play', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnPNXzj26cZtZ9BKHW4iVNKWHXB5KPVXvq9gG-lTizp_CS6lh6H6Tp1ZRT4kD_8NcNi64&usqp=CAU', 2.5),
(5, 7, 'Math Learning Set', 'Educational toy for learning mathematics', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_ZGnIHzfGtbhV7riebZLNxB7uMYAQ-thWzA&s', 0.5),
(6, 8, 'Texas-sized Frisbee', 'Large frisbee for outdoor fun', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXyMJGPztBOH4gx_xV5g7C16CXk3HFzjcykw&s', 0.2),
(7, 9, 'TexasStation 5', 'Next-gen gaming console', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwBPKyUVshSg5B_w0SxRgl-Pex4S0VSAD_Ew&s', 3.9),
(8, 10, 'Smart Thermostat', 'Energy-saving smart home device', 'https://media.istockphoto.com/id/1249397645/photo/man-uses-a-mobile-phone-with-smart-home-app-in-modern-living-room.jpg?s=612x612&w=0&k=20&c=dd1vWXdOIXQW2PAR27UmZjgGRAyUmL9nNbYeguQOAuo=g', 0.3),
(9, 3, 'Cowboy Action Figure', 'Detailed cowboy figure with accessories', 'https://thumbs.dreamstime.com/b/cowboy-toy-figure-15370167.jpg', 0.25);

-- Variant table
INSERT INTO variant (variant_id, product_id, inventory_stock, total_price, variant_image, SKU, Arrived_date) VALUES
(1, 1, 100, 19.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTKHAD5B-RkB0rgeStHdTOF-dF1HCOOYvZQQ&s', 'SUP-RED-001', '2024-09-15'),
(2, 1, 80, 19.99, 'https://img.freepik.com/premium-photo/cartoon-superman-smiles-as-he-runs-front-red-background_36682-302022.jpg', 'SUP-BLUE-001', '2024-09-16'),
(3, 2, 50, 49.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIM_emms9I7tfGVfA8DB5maFWffjNPd8iMQQ&s', 'STRAT-STD-001', '2024-09-20'),
(4, 3, 200, 699.99, 'https://media.istockphoto.com/id/1334658862/photo/receiver-with-spiral-cord-of-vintage-telephone-isolated-on-white.jpg?s=612x612&w=0&k=20&c=07l0RjClgjr9grp5p51ePLZ9n-WGUHy7WR8YVhmoSwM=', 'TXP-BLACK-001', '2024-09-22'),
(5, 3, 150, 699.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKDPsGSlcxX0LngHHUgNsaR0y009UezEGWeTkbW9WInvhwjkQe5LGYkTNuymWYvRuGbyI&usqp=CAU', 'TXP-WHITE-001', '2024-09-25'),
(6, 4, 75, 999.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUlhG1SLFZV7QTGajX-6Szrk3b0zJKPs68Sg&s', 'LSL-SILVER-001', '2024-09-27'),
(7, 5, 120, 29.99, 'https://img.freepik.com/free-vector/set-math-element_1308-25986.jpg', 'MATH-BASIC-001', '2024-10-01'),
(8, 6, 200, 24.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNtl-RmAPbTuHFNG9EEy7ffwhH0woOT25TcA&s', 'FRIS-BLUE-001', '2024-10-05'),
(9, 7, 50, 499.99, 'texasstation_black.jpg', 'TXS-BLACK-001', '2024-10-10'),
(10, 8, 100, 149.99, 'https://img.freepik.com/premium-photo/thermostat-with-white-background_933496-31737.jpg', 'THERM-WHITE-001', '2024-10-12');

-- Delivery Module table
INSERT INTO delivery_module (delivery_module_id, estimated_arrival_date) VALUES
(1, '2024-10-15'),
(2, '2024-10-16'),
(3, '2024-10-17'),
(4, '2024-10-18'),
(5, '2024-10-19'),
(6, '2024-10-20'),
(7, '2024-10-21'),
(8, '2024-10-22'),
(9, '2024-10-23'),
(10, '2024-10-24');

-- Address table
INSERT INTO address (address_id, address_line1, address_line2, city, region, postal_code, is_main_city) VALUES
(1, '123 Main St', 'Apt 4B', 'Houston', 'Texas', '77001', 1),
(2, '456 Oak Ave', NULL, 'Dallas', 'Texas', '75001', 1),
(3, '789 Pine Rd', 'Suite 101', 'Austin', 'Texas', '78701', 1),
(4, '321 Cedar Ln', NULL, 'San Antonio', 'Texas', '78201', 1),
(5, '654 Elm St', 'Unit 3', 'Fort Worth', 'Texas', '76101', 1),
(6, '987 Maple Dr', NULL, 'El Paso', 'Texas', '79901', 1),
(7, '147 Birch Ave', 'Apt 2C', 'Arlington', 'Texas', '76001', 0),
(8, '258 Spruce St', NULL, 'Corpus Christi', 'Texas', '78401', 0),
(9, '369 Willow Rd', 'Suite 205', 'Plano', 'Texas', '75023', 0),
(10, '741 Ash Ln', NULL, 'Lubbock', 'Texas', '79401', 0);

-- customer_address table
INSERT INTO customer_address (customer_id, address_id, is_default) VALUES 
(1, 1, 1),
(2, 1, 0),
(3, 3, 1),
(4, 2, 1),
(5, 5, 0),
(6, 5, 1),
(7, 7, 1),
(8, 8, 0),
(9, 8, 1),
(10, 10, 1);

-- Payment Method table
INSERT INTO payment_method (payment_method_id, name) VALUES
(1, 'Credit Card'),
(2, 'Debit Card'),
(3, 'PayPal'),
(4, 'Apple Pay'),
(5, 'Google Pay'),
(6, 'Bank Transfer'),
(7, 'Cash on Delivery'),
(8, 'Gift Card'),
(9, 'Cryptocurrency'),
(10, 'Afterpay');

-- Variation table
INSERT INTO variation (variation_id, category_id, name) VALUES
(1, 3, 'Size'),
(2, 3, 'Color'),
(3, 4, 'Edition'),
(4, 5, 'Storage Capacity'),
(5, 5, 'Color'),
(6, 6, 'Processor'),
(7, 7, 'Age Group'),
(8, 8, 'Size'),
(9, 9, 'Storage Capacity'),
(10, 10, 'Compatibility');

-- Variation Option table
INSERT INTO variation_option (variation_option_id, variation_id, value) VALUES
(1, 1, 'Small'),
(2, 1, 'Medium'),
(3, 1, 'Large'),
(4, 2, 'Red'),
(5, 2, 'Blue'),
(6, 3, 'Standard'),
(7, 3, 'Deluxe'),
(8, 4, '64GB'),
(9, 4, '128GB'),
(10, 5, 'Black');

-- variant_specification
INSERT INTO variant_specification (variant_id, variation_option_id) VALUES
(1, 1),
(1, 4),
(2, 1),
(2, 5),
(3, 6),
(4, 8),
(4, 10),
(5, 9),
(5, 5),
(6, 6),
(7, 7),
(8, 2),
(9, 9),
(10, 10);



-- Note: For tables like shopping_cart, user, shop_order, order_item, and shopping_cart_item, 
-- we would typically generate data based on user interactions rather than pre-populating them. 
-- However, here are some example inserts for demonstration purposes:


-- User table (assuming it's for tracking logins)
INSERT INTO user (user_id, customer_id, login_time) VALUES
(1, 1, '2024-10-08 09:00:00'),
(2, 2, '2024-10-08 10:30:00'),
(3, 3, '2024-10-08 11:45:00'),
(4, 4, '2024-10-08 13:15:00'),
(5, 5, '2024-10-08 14:30:00'),
(6, 6, '2024-10-08 15:45:00'),
(7, 7, '2024-10-08 16:00:00'),
(8, 8, '2024-10-08 17:30:00'),
(9, 9, '2024-10-08 18:45:00'),
(10, 10, '2024-10-08 20:00:00');

-- Shop Order table
INSERT INTO shop_order (order_id, user_id, delivery_module_id, order_date, payment_method_id, delivery_method, delivery_address_id, total_order_price, order_status) VALUES
(1, 1, 1, '2024-10-08 10:00:00', 1, 'standard', 1, 59.97, 'pending'),
(2, 2, 2, '2024-10-08 11:30:00', 2, 'express', 2, 699.99, 'shipped'),
(3, 3, 3, '2024-10-08 12:45:00', 3, 'standard', 3, 49.99, 'pending'),
(4, 4, 4, '2024-10-08 14:15:00', 1, 'overnight', 4, 999.99, 'shipped'),
(5, 5, 5, '2024-10-08 15:30:00', 4, 'standard', 5, 29.99, 'delivered'),
(6, 6, 6, '2024-10-08 16:45:00', 2, 'express', 6, 524.98, 'pending'),
(7, 7, 7, '2024-10-08 17:00:00', 5, 'standard', 7, 149.99, 'shipped'),
(8, 8, 8, '2024-10-08 18:30:00', 3, 'overnight', 8, 1399.98, 'pending'),
(9, 9, 9, '2024-10-08 19:45:00', 1, 'standard', 9, 74.97, 'delivered'),
(10, 10, 10, '2024-10-08 21:00:00', 4, 'express', 10, 499.99, 'shipped');

-- Shopping Cart Item table
INSERT INTO shopping_cart_item (shopping_cart_item_id, shopping_cart_id, variant_id, quantity) VALUES
(1, 1, 2, 1),
(2, 1, 5, 1),
(3, 1, 3, 2),
(4, 1, 7, 1);

-- Order Item table
INSERT INTO order_item (order_item_id, order_id, variant_id, quantity, price) VALUES
(1, 1, 1, 3, 59.97),
(2, 2, 4, 1, 699.99),
(3, 3, 3, 1, 49.99),
(4, 4, 6, 1, 999.99),
(5, 5, 7, 1, 29.99),
(6, 6, 8, 1, 24.99),
(7, 6, 1, 2, 39.99),
(8, 7, 10, 1, 149.99),
(9, 8, 4, 2, 1399.98),
(10, 9, 1, 3, 59.97);


