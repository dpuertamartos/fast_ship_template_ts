CREATE TABLE user (
    id BIGINT UNSIGNED AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    created_at DATETIME COMMENT 'UTC time',
    updated_at DATETIME COMMENT 'UTC time',
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id BIGINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(255),
    created_at DATETIME COMMENT 'UTC time',
    updated_at DATETIME COMMENT 'UTC time',
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE user_role (
    id BIGINT UNSIGNED AUTO_INCREMENT,
    user_id BIGINT UNSIGNED,
    role_id BIGINT UNSIGNED,
    created_at DATETIME COMMENT 'UTC time',
    updated_at DATETIME COMMENT 'UTC time',
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

