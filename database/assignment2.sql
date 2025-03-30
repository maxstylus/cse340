INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE FROM account
WHERE account_email = 'tony@starkent.com';

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

SELECT inventory.make, inventory.model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

UPDATE inventory
SET 
    inv_image = CONCAT('/images/vehicles/', SUBSTRING(inv_image FROM 9)),
    inv_thumbnail = CONCAT('/images/vehicles/', SUBSTRING(inv_thumbnail FROM 9));

