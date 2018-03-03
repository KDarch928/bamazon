DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE product (
	item_id INT AUTO_INCREMENT  NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,2) DEFAULT 0,
    stock_quanity INT DEFAULT 0,
	PRIMARY KEY (item_id)
);