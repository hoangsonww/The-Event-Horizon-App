CREATE DATABASE IF NOT EXISTS EventHorizon;

USE EventHorizon;

CREATE TABLE IF NOT EXISTS events (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(255) NOT NULL,
                                      date_time DATETIME NOT NULL,
                                      description TEXT
    );

CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(255) NOT NULL,
                                     password_hash VARCHAR(255) NOT NULL,
                                     email VARCHAR(255)
    );
