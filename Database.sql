CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(25) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(5000) NOT NULL,
    email VARCHAR(255) NOT NULL,
    isVerified TINYINT(1) DEFAULT 0,
    isActive TINYINT(1) DEFAULT 1,
    role ENUM('user', 'admin') DEFAULT 'user',
    UNIQUE (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;