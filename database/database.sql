-- Drop and delete existing database and tables
DROP DATABASE IF EXISTS ecommerce;

-- Create the database
CREATE DATABASE ecommerce;

-- Use the new database
USE ecommerce;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS `shopping_cart_item`;
DROP TABLE IF EXISTS `order_item`;
DROP TABLE IF EXISTS `customer_address`;
DROP TABLE IF EXISTS `variant_specification`;
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
drop TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `admin`;


CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Re-create all the tables with indexes
CREATE TABLE `customer` (
  `customer_id` int auto_increment,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email_address` varchar(255),
  `username` varchar(50) unique,
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


CREATE TABLE cards (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    card_owner VARCHAR(50),                 -- Name of the card owner
    card_number CHAR(16),                   -- Full card number
    card_type VARCHAR(20) DEFAULT 'Visa',   -- Default to "Visa"
    last_four_digits CHAR(4),               -- Last 4 digits of the card number for reference
    expiration_date VARCHAR(5),             -- Expiration date in MM/YY format
    token VARCHAR(100),                     -- Tokenized card number (from payment processor)
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

CREATE TABLE `shopping_cart` (
  `shopping_cart_id` INT AUTO_INCREMENT,
  `customer_id` INT,
  `subtotal` DECIMAL(10, 2) DEFAULT 0.00,
  `shipping` DECIMAL(10, 2) DEFAULT 0.00,
  `tax` DECIMAL(10, 2) DEFAULT 0.00,
  `discount` DECIMAL(10, 2) DEFAULT 0.00,
  `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shopping_cart_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);






CREATE TABLE `category` (
  `category_id` int AUTO_INCREMENT,
  `category_name` varchar(100),
  `parent_category_id` int,
  `category_image` varchar(255),
  PRIMARY KEY (`category_id`),
  FOREIGN KEY (`parent_category_id`) REFERENCES `category`(`category_id`)
);

CREATE TABLE `product` (
  `product_id` int AUTO_INCREMENT,
  `category_id` int,
  `product_name` varchar(255),
  `description` text(65535),
  `product_image` varchar(255),
  `weight` decimal(5,1),
  `rating` decimal(2,1) DEFAULT 0.0,  -- New rating column
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
  `Arrived_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`variant_id`),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`),
  
  -- Indexes
  INDEX idx_product_id (`product_id`)
);

CREATE TABLE `shopping_cart_item` (
  `shopping_cart_item_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `shopping_cart_id` int,
  `variant_id` int,
  `quantity` int,
  `saved_for_later` TINYINT(1) NOT NULL DEFAULT 0,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shopping_cart_item_id`),
  FOREIGN KEY (`shopping_cart_id`) REFERENCES `shopping_cart`(`shopping_cart_id`),
  FOREIGN KEY (`variant_id`) REFERENCES `variant`(`variant_id`)
);


CREATE TABLE `address` (
  `address_id` INT AUTO_INCREMENT,
  `address_line1` VARCHAR(255),
  `address_line2` VARCHAR(255),
  `city` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `is_main_city` TINYINT DEFAULT 0,
  PRIMARY KEY (`address_id`)
);

CREATE TABLE `payment_method` (
  `payment_method_id` int,
  `name` varchar(200),
  PRIMARY KEY (`payment_method_id`)
);

CREATE TABLE `delivery_module` (
  `delivery_module_id` int,
  `estimated_arrival_date` date,
  PRIMARY KEY (`delivery_module_id`)
);
CREATE TABLE `shop_order` (
  `order_id` int auto_increment,
  `customer_id` int,
  `delivery_module_id` int,
  `order_date` datetime,
  `payment_method_id` int,
  `delivery_method` enum('standard', 'express', 'overnight'),
  `delivery_address_id` int,
  `total_order_price` decimal(10, 2),
  `subtotal` decimal(10, 2) NOT NULL DEFAULT 0.00,
  `shipping` decimal(10, 2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10, 2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10, 2) DEFAULT 0.00, 
  `shipping_date` datetime NULL,
  `order_status` enum('pending', 'shipped', 'delivered', 'canceled'),
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`),
  FOREIGN KEY (`delivery_module_id`) REFERENCES `delivery_module`(`delivery_module_id`),
  FOREIGN KEY (`delivery_address_id`) REFERENCES `address`(`address_id`),
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`payment_method_id`)
);



CREATE TABLE `order_item` (
  `order_item_id` int auto_increment,
  `order_id` int,
  `variant_id` int,
  `quantity` int,
  `price` decimal(7,2),
  PRIMARY KEY (`order_item_id`),
  FOREIGN KEY (`order_id`) REFERENCES `shop_order`(`order_id`) ON DELETE CASCADE
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
  `customer_id` int,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);






CREATE TABLE `customer_phone_number` (
  `phone_number` varchar(20),
  `customer_id` int,
  PRIMARY KEY (`phone_number`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);

CREATE TABLE `variant_specification` (
  `variant_id` int,
  `variation_option_id` int,
  PRIMARY KEY (`variant_id`, `variation_option_id`),
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



--------------- admin --------

DROP VIEW IF EXISTS report;
CREATE VIEW report AS 
SELECT order_date, payment_method.name AS payment_method_name, delivery_method, total_order_price, subtotal, shipping, tax, shipping_date, order_status, order_item.quantity AS quantity
FROM (shop_order INNER JOIN payment_method ON shop_order.payment_method_id = payment_method.payment_method_id) 
	INNER JOIN order_item ON shop_order.order_id = order_item.order_item_id;
DELIMITER $$

DROP PROCEDURE IF EXISTS getReport;

CREATE PROCEDURE getReport(
    IN order_time_p ENUM("Monthly", "Quartly", "Half Year", "Annual"),
    IN payment_method_p VARCHAR(200),
    IN delivery_method_p ENUM('standard', 'express', 'overnight'),
    IN total_order_price_min_p DECIMAL(10,2),
    IN total_order_price_max_p DECIMAL(10,2),
    IN order_status_p ENUM('pending', 'shipped', 'delivered', 'canceled'),
    IN quantity_p INT
)
BEGIN
    -- Set default values if min/max price is NULL
    IF total_order_price_min_p IS NULL THEN
        SET total_order_price_min_p = 0;
    END IF;
    IF total_order_price_max_p IS NULL THEN
        SET total_order_price_max_p = 99999999.99;
    END IF;

    -- Monthly Report
    IF order_time_p IS NULL OR order_time_p = "Monthly" THEN
        SELECT 
            DATE_FORMAT(order_date, '%Y-%m') AS report_month,
            AVG(total_order_price) AS avg_total_price,
            AVG(subtotal) AS avg_subtotal,
            AVG(shipping) AS avg_shipping,
            AVG(tax) AS avg_tax,
            AVG(quantity) AS avg_quantity
        FROM report
        WHERE 
            (payment_method_p IS NULL OR payment_method_p = report.payment_method_name)
            AND (delivery_method_p IS NULL OR delivery_method_p = report.delivery_method)
            AND (report.total_order_price BETWEEN total_order_price_min_p AND total_order_price_max_p)
            AND (order_status_p IS NULL OR order_status_p = report.order_status)
            AND (quantity_p IS NULL OR quantity_p = report.quantity)
        GROUP BY DATE_FORMAT(order_date, '%Y-%m')
        ORDER BY report_month DESC;

    -- Quarterly Report
    ELSEIF order_time_p = "Quartly" THEN
        SELECT 
            CONCAT(YEAR(order_date), '-Q', QUARTER(order_date)) AS report_quarter,
            AVG(total_order_price) AS avg_total_price,
            AVG(subtotal) AS avg_subtotal,
            AVG(shipping) AS avg_shipping,
            AVG(tax) AS avg_tax,
            AVG(quantity) AS avg_quantity
        FROM report
        WHERE 
            (payment_method_p IS NULL OR payment_method_p = report.payment_method_name)
            AND (delivery_method_p IS NULL OR delivery_method_p = report.delivery_method)
            AND (report.total_order_price BETWEEN total_order_price_min_p AND total_order_price_max_p)
            AND (order_status_p IS NULL OR order_status_p = report.order_status)
            AND (quantity_p IS NULL OR quantity_p = report.quantity)
        GROUP BY CONCAT(YEAR(order_date), '-Q', QUARTER(order_date))
        ORDER BY report_quarter DESC;

    -- Half-Year Report
    ELSEIF order_time_p = "Half Year" THEN
        SELECT 
            CONCAT(YEAR(order_date), '-H', IF(MONTH(order_date) <= 6, 1, 2)) AS report_half_year,
            AVG(total_order_price) AS avg_total_price,
            AVG(subtotal) AS avg_subtotal,
            AVG(shipping) AS avg_shipping,
            AVG(tax) AS avg_tax,
            AVG(quantity) AS avg_quantity
        FROM report
        WHERE 
            (payment_method_p IS NULL OR payment_method_p = report.payment_method_name)
            AND (delivery_method_p IS NULL OR delivery_method_p = report.delivery_method)
            AND (report.total_order_price BETWEEN total_order_price_min_p AND total_order_price_max_p)
            AND (order_status_p IS NULL OR order_status_p = report.order_status)
            AND (quantity_p IS NULL OR quantity_p = report.quantity)
        GROUP BY CONCAT(YEAR(order_date), '-H', IF(MONTH(order_date) <= 6, 1, 2))
        ORDER BY report_half_year DESC;

    -- Annual Report
    ELSEIF order_time_p = "Annual" THEN
        SELECT 
            YEAR(order_date) AS report_year,
            AVG(total_order_price) AS avg_total_price,
            AVG(subtotal) AS avg_subtotal,
            AVG(shipping) AS avg_shipping,
            AVG(tax) AS avg_tax,
            AVG(quantity) AS avg_quantity
        FROM report
        WHERE 
            (payment_method_p IS NULL OR payment_method_p = report.payment_method_name)
            AND (delivery_method_p IS NULL OR delivery_method_p = report.delivery_method)
            AND (report.total_order_price BETWEEN total_order_price_min_p AND total_order_price_max_p)
            AND (order_status_p IS NULL OR order_status_p = report.order_status)
            AND (quantity_p IS NULL OR quantity_p = report.quantity)
        GROUP BY YEAR(order_date)
        ORDER BY report_year DESC;
    END IF;
END $$

DELIMITER ;
------------------- admin -------------

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

DELIMITER $$

DROP TRIGGER IF EXISTS handle_order_creation$$

CREATE TRIGGER handle_order_creation
AFTER INSERT ON shop_order
FOR EACH ROW
BEGIN
    DECLARE cart_id INT;
    
    -- Get the most recent cart for the customer
    SELECT shopping_cart_id INTO cart_id
    FROM shopping_cart
    WHERE customer_id = NEW.customer_id
    ORDER BY shopping_cart_id DESC  -- assuming higher IDs are more recent
    LIMIT 1;
    
    -- Only proceed if we found a cart
    IF cart_id IS NOT NULL THEN
        -- Insert order items from the shopping cart
        
        INSERT INTO order_item (order_id, variant_id, quantity, price)
        SELECT NEW.order_id, sci.variant_id, sci.quantity, v.total_price
        FROM shopping_cart_item sci
        JOIN variant v ON sci.variant_id = v.variant_id
        WHERE sci.shopping_cart_id = cart_id
        AND sci.saved_for_later = 0;

        -- Delete the shopping cart items
        DELETE FROM shopping_cart_item
        WHERE shopping_cart_id = cart_id
        AND saved_for_later = 0;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No shopping cart found for this customer';
    END IF;
END$$

DELIMITER ;


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
    shop_order so ON c.customer_id = so.customer_id
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

INSERT INTO product (product_id, category_id, product_name, description, product_image, weight, rating) VALUES
(1, 3, 'Superhero Action Figure', 'Poseable superhero figure', 'https://media.istockphoto.com/id/458945985/photo/partners-against-crime.jpg?s=612x612&w=0&k=20&c=r6A4YzG_TAyGF2jGoJSwY6PizSqC9BcIi_PSQBfq5CA=', 0.3, 4.5),
(2, 4, 'Strategy Board Game', 'Complex strategy game for adults', 'https://www.shutterstock.com/image-vector/isometric-board-games-various-boardgames-600nw-2322698469.jpg', 1.2, 4.2),
(3, 5, 'TexasPhone X', 'Latest smartphone with advanced features', 'https://www.shutterstock.com/image-illustration/3d-mobile-phone-sim-card-260nw-1880249659.jpg', 0.18, 4.8),
(4, 6, 'LoneStar Laptop', 'Powerful laptop for work and play', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnPNXzj26cZtZ9BKHW4iVNKWHXB5KPVXvq9gG-lTizp_CS6lh6H6Tp1ZRT4kD_8NcNi64&usqp=CAU', 2.5, 4.7),
(5, 7, 'Math Learning Set', 'Educational toy for learning mathematics', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_ZGnIHzfGtbhV7riebZLNxB7uMYAQ-thWzA&s', 0.5, 4.3),
(6, 8, 'Texas-sized Frisbee', 'Large frisbee for outdoor fun', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXyMJGPztBOH4gx_xV5g7C16CXk3HFzjcykw&s', 0.2, 4.1),
(7, 9, 'TexasStation 5', 'Next-gen gaming console', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwBPKyUVshSg5B_w0SxRgl-Pex4S0VSAD_Ew&s', 3.9, 4.9),
(8, 3, 'Smart Thermostat', 'Energy-saving smart home device', 'https://media.istockphoto.com/id/1249397645/photo/man-uses-a-mobile-phone-with-smart-home-app-in-modern-living-room.jpg?s=612x612&w=0&k=20&c=dd1vWXdOIXQW2PAR27UmZjgGRAyUmL9nNbYeguQOAuo=g', 0.3, 4.6),
(9, 3, 'Cowboy Action Figure', 'Detailed cowboy figure with accessories', 'https://thumbs.dreamstime.com/b/cowboy-toy-figure-15370167.jpg', 0.25, 4.4),
(10, 4, 'Chess Set', 'Classic wooden chess set', 'https://example.com/chess.jpg', 1.5, 4.9),
(11, 5, 'Wireless Earbuds', 'Noise-cancelling wireless earbuds', 'https://example.com/earbuds.jpg', 0.05, 4.7),
(12, 6, 'Running Shoes', 'High-performance running shoes', 'https://example.com/shoes.jpg', 0.8, 4.6),
(13, 7, 'RC Helicopter', 'Remote control helicopter with camera', 'https://example.com/helicopter.jpg', 1.2, 4.4),
(14, 8, 'Smart Watch', 'Fitness tracking smart watch', 'https://example.com/smartwatch.jpg', 0.12, 4.5),
(15, 9, 'Bluetooth Speaker', 'Portable Bluetooth speaker with waterproof design', 'https://example.com/speaker.jpg', 0.4, 4.8),
(16, 3, 'Camping Tent', '4-person waterproof camping tent', 'https://example.com/tent.jpg', 3.5, 4.2),
(17, 4, 'Mountain Bike', 'Off-road mountain bike', 'https://example.com/bike.jpg', 15.0, 4.8),
(18, 5, 'Digital Camera', 'High-resolution DSLR camera', 'https://example.com/camera.jpg', 1.8, 4.9),
(19, 6, 'Electric Kettle', 'Fast-boiling electric kettle', 'https://example.com/kettle.jpg', 0.9, 4.4),
(20, 7, 'Yoga Mat', 'Non-slip eco-friendly yoga mat', 'https://example.com/yogamat.jpg', 1.0, 4.5),
(21, 8, 'Drone', 'Quadcopter drone with 4K camera', 'https://example.com/drone.jpg', 0.7, 4.6),
(22, 9, 'Gaming Mouse', 'High-precision gaming mouse', 'https://example.com/mouse.jpg', 0.2, 4.7),
(23, 3, 'Hiking Backpack', 'Durable backpack for outdoor adventures', 'https://example.com/backpack.jpg', 1.4, 4.7),
(24, 4, 'Electric Guitar', 'Electric guitar with amplifier', 'https://example.com/guitar.jpg', 3.2, 4.6),
(25, 5, 'Tablet', '10-inch tablet with stylus', 'https://example.com/tablet.jpg', 0.9, 4.8),
(26, 6, 'Coffee Maker', 'Automatic coffee machine with grinder', 'https://example.com/coffeemaker.jpg', 3.4, 4.5),
(27, 7, 'Skateboard', 'Trick skateboard with graphic design', 'https://example.com/skateboard.jpg', 2.5, 4.3),
(28, 8, 'VR Headset', 'Virtual reality headset with motion controllers', 'https://example.com/vr.jpg', 0.6, 4.9),
(29, 9, 'Noise-Cancelling Headphones', 'Over-ear noise-cancelling headphones', 'https://example.com/headphones.jpg', 0.35, 4.8),
(30, 3, 'Fishing Rod', 'Carbon fiber fishing rod', 'https://example.com/fishingrod.jpg', 1.1, 4.6),
(31, 4, 'Smart Home Hub', 'Voice-controlled smart home hub', 'https://example.com/smarthub.jpg', 0.7, 4.7),
(32, 5, 'Electric Scooter', 'Foldable electric scooter', 'https://example.com/scooter.jpg', 12.0, 4.8),
(33, 6, 'Air Fryer', 'Oil-less air fryer for healthy cooking', 'https://example.com/airfryer.jpg', 5.0, 4.7),
(34, 7, 'Basketball', 'Official size outdoor basketball', 'https://example.com/basketball.jpg', 0.62, 4.5),
(35, 8, 'E-Reader', 'E-ink e-reader with backlight', 'https://example.com/ereader.jpg', 0.15, 4.6),
(36, 9, 'Gaming Chair', 'Ergonomic gaming chair with lumbar support', 'https://example.com/gamingchair.jpg', 14.0, 4.8),
(37, 3, 'Tent Heater', 'Portable propane tent heater', 'https://example.com/tentheater.jpg', 2.3, 4.4),
(38, 4, 'Electric Toothbrush', 'Smart electric toothbrush with app', 'https://example.com/toothbrush.jpg', 0.3, 4.7),
(39, 5, 'Projector', '4K home theater projector', 'https://example.com/projector.jpg', 4.5, 4.8),
(40, 6, 'Portable Power Bank', 'High-capacity portable charger', 'https://example.com/powerbank.jpg', 0.4, 4.6);

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

INSERT INTO `address` (`address_line1`, `address_line2`, `city`, `postal_code`, `is_main_city`)
VALUES
('1600 Pennsylvania Ave NW', NULL, 'Washington', '20500', 1),
('221B Baker St', NULL, 'London', 'NW1 6XE', 1),
('350 Fifth Avenue', 'Suite 5100', 'New York', '10118', 1),
('1 Infinite Loop', NULL, 'Cupertino', '95014', 0),
('1 Queen Street', 'Level 2', 'Auckland', '1010', 1),
('100 Queen St W', '3rd Floor', 'Toronto', 'M5H 2N2', 1),
('742 Evergreen Terrace', NULL, 'Springfield', '62704', 0),
('55 Rue du Faubourg Saint-Antoine', NULL, 'Paris', '75012', 1),
('Friedrichstraße 43-45', NULL, 'Berlin', '10117', 1),
('10 Downing St', NULL, 'London', 'SW1A 2AA', 1);


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

-- Shop Order tables
INSERT INTO shop_order (order_id, customer_id, delivery_module_id, order_date, payment_method_id, delivery_method, delivery_address_id, total_order_price, subtotal, shipping, tax, shipping_date, order_status) VALUES
(1, 1, 1, '2024-10-08 10:00:00', 1, 'standard', 1, 59.97, 49.99, 9.99, 2.00, '2024-10-10 10:00:00', 'pending'),
(2, 2, 2, '2024-10-08 11:30:00', 2, 'express', 2, 699.99, 600.00, 25.00, 60.00, '2024-10-09 11:30:00', 'shipped'),
(3, 3, 3, '2024-10-08 12:45:00', 3, 'standard', 3, 49.99, 40.00, 5.00, 4.00, '2024-10-10 12:45:00', 'pending'),
(4, 4, 4, '2024-10-08 14:15:00', 1, 'overnight', 4, 999.99, 800.00, 30.00, 80.00, '2024-10-08 14:15:00', 'shipped'),
(5, 5, 5, '2024-10-08 15:30:00', 4, 'standard', 5, 29.99, 20.00, 3.00, 2.00, '2024-10-08 15:30:00', 'delivered'),
(6, 6, 6, '2024-10-08 16:45:00', 2, 'express', 6, 524.98, 500.00, 15.00, 40.00, '2024-10-09 16:45:00', 'pending'),
(7, 7, 7, '2024-10-08 17:00:00', 5, 'standard', 7, 149.99, 120.00, 7.00, 10.00, '2024-10-08 17:00:00', 'shipped'),
(8, 8, 8, '2024-10-08 18:30:00', 3, 'overnight', 8, 1399.98, 1300.00, 50.00, 90.00, '2024-10-10 18:30:00', 'pending'),
(9, 9, 9, '2024-10-08 19:45:00', 1, 'standard', 9, 74.97, 60.00, 5.00, 5.00, '2024-10-08 19:45:00', 'delivered'),
(10, 10, 10, '2024-10-08 21:00:00', 4, 'express', 10, 499.99, 450.00, 20.00, 30.00, '2024-10-09 21:00:00', 'shipped');


-- Shopping Cart Item table
INSERT INTO shopping_cart_item (shopping_cart_item_id, shopping_cart_id, variant_id, quantity) VALUES
(1, 1, 2, 1),
(2, 2, 5, 1),
(3, 3, 3, 2),
(4, 4, 7, 1),
(5, 5, 9, 1),
(6, 6, 1, 3),
(7, 7, 6, 1),
(8, 8, 8, 2),
(9, 9, 10, 1),
(10, 10, 4, 1);

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


INSERT INTO cards (customer_id, card_owner, card_number, card_type, last_four_digits, expiration_date, token)
VALUES 
    (1, 'Alice Johnson', '1234567812345678', 'Visa', '5678', '06/25', 'tok_visa_1234abcd'),
    (2, 'Bob Smith', '9876543212345678', 'Visa', '5678', '11/24', 'tok_visa_5678efgh'),
    (3, 'Charlie Brown', '1234567890123456', 'MasterCard', '3456', '03/26', 'tok_master_9012ijkl'),
    (4, 'Diana Prince', '5678123456781234', 'Amex', '1234', '09/25', 'tok_amex_3456mnop'),
    (5, 'Edward Stone', '3456789012345678', 'Visa', '5678', '12/24', 'tok_visa_7890qrst'),
    (6, 'Fiona Gray', '9012345678123456', 'MasterCard', '3456', '01/27', 'tok_master_4321uvwx'),
    (7, 'George Wilson', '1234567890123456', 'Visa', '5678', '08/23', 'tok_visa_8765yzab'),
    (8, 'Hannah Lee', '5678123456781234', 'Discover', '1234', '05/28', 'tok_discover_2345cdef'),
    (9, 'Ivan Rogers', '3456789012345678', 'Visa', '5678', '10/26', 'tok_visa_6789ghij'),
    (10, 'Julia Chen', '9012345678123456', 'MasterCard', '3456', '02/25', 'tok_master_1111klmn');
