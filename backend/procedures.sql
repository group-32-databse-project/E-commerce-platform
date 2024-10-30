DELIMITER //

-- update the 4n number for a customer

CREATE PROCEDURE insert_phone_number(
    IN cust_id INT,
    IN phone_num VARCHAR(15)
)
BEGIN
    -- Delete all four-digit phone numbers for the given customer
    DELETE FROM customer_phone_number
    WHERE customer_id = cust_id;
    
    -- Insert the new phone number for the customer
    INSERT INTO customer_phone_number (phone_number, customer_id)
    VALUES (phone_num, cust_id);
END //

DELIMITER ;