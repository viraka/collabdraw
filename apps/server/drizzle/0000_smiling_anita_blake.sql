CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"tag" text NOT NULL,
	"password_hash" text NOT NULL,
	"refresh_token_hash" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_tag_unique" UNIQUE("tag")
);
