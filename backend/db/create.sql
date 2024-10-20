CREATE TABLE Users (
    user_id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
);

CREATE TABLE Projects (
    vendor_uid INT NOT NULL, -- Vendor's UID
    project_id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    project_name VARCHAR(255) NOT NULL,
    description VARCHAR(1023) NOT NULL,
    price_per_image DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (vendor_uid) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Images (
    image_id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    image_url VARCHAR(255) NOT NULL,
    project_id INT NOT NULL,
    labeled_status BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_status BOOLEAN NOT NULL DEFAULT FALSE,
    labeler_uid INT,
    label_text VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE
);

CREATE TABLE Payments (
    user_id INT NOT NULL,
    transaction_time TIMESTAMP NOT NULL,
    balance_change DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (user_id, transaction_time)
);

CREATE TABLE Roles (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role_name VARCHAR NOT NULL CHECK (role_name IN ('owner', 'reviewer', 'labeler', 'admin')),
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);