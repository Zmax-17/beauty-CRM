PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`service_id` text NOT NULL,
	`user_id` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`price` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "appointments_price_non_negative" CHECK("__new_appointments"."price" >= 0),
	CONSTRAINT "appointments_valid_time" CHECK("__new_appointments"."end_time" > "__new_appointments"."start_time")
);
--> statement-breakpoint
INSERT INTO `__new_appointments`("id", "client_id", "service_id", "user_id", "start_time", "end_time", "status", "price", "notes", "created_at", "updated_at") SELECT "id", "client_id", "service_id", "user_id", "start_time", "end_time", "status", "price", "notes", "created_at", "updated_at" FROM `appointments`;--> statement-breakpoint
DROP TABLE `appointments`;--> statement-breakpoint
ALTER TABLE `__new_appointments` RENAME TO `appointments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_services` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`duration` integer NOT NULL,
	`price` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "services_duration_positive" CHECK("__new_services"."duration" > 0),
	CONSTRAINT "services_price_non_negative" CHECK("__new_services"."price" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_services`("id", "name", "duration", "price", "created_at", "updated_at") SELECT "id", "name", "duration", "price", "created_at", "updated_at" FROM `services`;--> statement-breakpoint
DROP TABLE `services`;--> statement-breakpoint
ALTER TABLE `__new_services` RENAME TO `services`;