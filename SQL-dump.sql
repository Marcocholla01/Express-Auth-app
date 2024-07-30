-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.37 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET NAMES utf8 */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
-- Dumping database structure for auth-app
DROP DATABASE IF EXISTS `auth-app`;
CREATE DATABASE IF NOT EXISTS `auth-app`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
/*!80016 DEFAULT ENCRYPTION='N' */
;
USE `auth-app`;
-- Dumping structure for table auth-app.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
    `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `firstName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` varchar(5000) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `isVerified` tinyint(1) DEFAULT '0',
    `isActive` tinyint(1) DEFAULT '1',
    `role` enum('user', 'admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
    `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`userId`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Data exporting was unselected.
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */
;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */
;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */
;