CREATE TABLE `group_chat` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `creator` varchar(200) NOT NULL,
  `group_name` varchar(250) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `pinned_message` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`group_id`,`creator`),
  KEY `fk_group_creator` (`creator`),
  CONSTRAINT `fk_group_creator` FOREIGN KEY (`creator`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
CREATE TABLE `group_user` (
  `group_id` int NOT NULL,
  `email` varchar(200) NOT NULL,
  `join_date` datetime DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`group_id`,`email`),
  KEY `fk_gug` (`email`),
  CONSTRAINT `fk_gug` FOREIGN KEY (`email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
CREATE TABLE `user` (
  `username` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(1500) NOT NULL,
  `firstname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `otp_pending` tinyint(1) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `bithday` datetime DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `salt` varchar(50) DEFAULT NULL,
  `refresh_token` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`email`,`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
CREATE TABLE `user_otp` (
  `u_otp_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `otp` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`u_otp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
