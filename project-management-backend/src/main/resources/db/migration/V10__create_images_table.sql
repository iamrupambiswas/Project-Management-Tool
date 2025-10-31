-- V10__create_images_table.sql

CREATE TABLE images (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(512) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    format VARCHAR(50),
    size BIGINT,
    folder VARCHAR(100)
);

ALTER TABLE users
ADD COLUMN image_id BIGINT,
ADD CONSTRAINT fk_users_image FOREIGN KEY (image_id) REFERENCES images (id);
