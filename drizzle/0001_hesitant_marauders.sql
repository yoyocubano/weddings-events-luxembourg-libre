CREATE TABLE `client_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`eventType` varchar(100) NOT NULL,
	`eventDate` timestamp,
	`location` varchar(300),
	`budget` varchar(100),
	`guestCount` int,
	`serviceInterest` varchar(200),
	`message` text,
	`status` enum('new','contacted','quoted','booked','completed','cancelled') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `portfolio_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`location` varchar(200),
	`eventDate` timestamp,
	`coverImageUrl` text NOT NULL,
	`imageUrls` text NOT NULL,
	`featured` int NOT NULL DEFAULT 0,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`features` text NOT NULL,
	`price` decimal(10,2),
	`priceLabel` varchar(100),
	`popular` int NOT NULL DEFAULT 0,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_packages_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_packages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`role` varchar(150) NOT NULL,
	`bio` text,
	`imageUrl` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
