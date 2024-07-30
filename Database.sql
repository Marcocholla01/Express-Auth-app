CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(25) NOT NULL PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(5000) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    isVerified TINYINT(1) DEFAULT 0,
    isActive TINYINT(1) DEFAULT 1,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    UNIQUE (email)
);