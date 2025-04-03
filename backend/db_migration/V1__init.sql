CREATE TABLE user (
    id SERIAL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    created_at DATETIME COMMENT 'UTC time',
    updated_at DATETIME COMMENT 'UTC time',
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);