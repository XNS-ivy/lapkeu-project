/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 120002 (12.0.2-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : ecommerce_barang_berbahaya

 Target Server Type    : MySQL
 Target Server Version : 120002 (12.0.2-MariaDB)
 File Encoding         : 65001

 Date: 24/12/2025 08:12:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `admin_id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for agent
-- ----------------------------
DROP TABLE IF EXISTS `agent`;
CREATE TABLE `agent`  (
  `agent_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `organization_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `login_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `login_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`agent_id`) USING BTREE,
  INDEX `fk_from_organization`(`organization_code` ASC) USING BTREE,
  CONSTRAINT `fk_from_organization` FOREIGN KEY (`organization_code`) REFERENCES `organization` (`organization_code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for create_order
-- ----------------------------
DROP TABLE IF EXISTS `create_order`;
CREATE TABLE `create_order`  (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `delivery_type` enum('SUPPLY','BUY') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `fk_from_agent`(`agent_id` ASC) USING BTREE,
  CONSTRAINT `fk_from_agent` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`agent_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for deliver_items
-- ----------------------------
DROP TABLE IF EXISTS `deliver_items`;
CREATE TABLE `deliver_items`  (
  `delivery_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `material_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `storage_id` int NOT NULL,
  `deliver_quantity` float(255, 2) NOT NULL,
  PRIMARY KEY (`delivery_id`) USING BTREE,
  INDEX `fk_create_order`(`order_id` ASC) USING BTREE,
  INDEX `fk_material_code`(`material_code` ASC) USING BTREE,
  INDEX `fk_storagE_id`(`storage_id` ASC) USING BTREE,
  CONSTRAINT `fk_create_order` FOREIGN KEY (`order_id`) REFERENCES `create_order` (`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_material_code` FOREIGN KEY (`material_code`) REFERENCES `material` (`material_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storagE_id` FOREIGN KEY (`storage_id`) REFERENCES `storage` (`storage_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for material
-- ----------------------------
DROP TABLE IF EXISTS `material`;
CREATE TABLE `material`  (
  `material_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `material_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `price` float NOT NULL,
  `hazzard_class` enum('Explosive','Gases','Flammable Liquid','Flammable Solid','Oxidizer','Poison','Radioactive','Corrosive','Miscellaneous') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `hazzard_level` enum('1','2','3','4','5') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`material_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for organization
-- ----------------------------
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization`  (
  `organization_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `organization_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `organization_type` enum('Supplier','Customer','Mixed') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `contact` int NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`organization_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for storage
-- ----------------------------
DROP TABLE IF EXISTS `storage`;
CREATE TABLE `storage`  (
  `storage_id` int NOT NULL AUTO_INCREMENT,
  `material_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `quantity` float(255, 2) NOT NULL,
  PRIMARY KEY (`storage_id`) USING BTREE,
  INDEX `fk_from_material`(`material_code` ASC) USING BTREE,
  CONSTRAINT `fk_from_material` FOREIGN KEY (`material_code`) REFERENCES `material` (`material_code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Triggers structure for table deliver_items
-- ----------------------------
DROP TRIGGER IF EXISTS `add_to_storage`;
delimiter ;;
CREATE TRIGGER `add_to_storage` AFTER INSERT ON `deliver_items` FOR EACH ROW UPDATE storage 
SET quantity = quantity + NEW.deliver_quantity
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table material
-- ----------------------------
DROP TRIGGER IF EXISTS `auto_add_to_storage`;
delimiter ;;
CREATE TRIGGER `auto_add_to_storage` AFTER INSERT ON `material` FOR EACH ROW INSERT INTO storage (material_code, quantity)
VALUES (NEW.material_code, 0)
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
