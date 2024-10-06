CREATE TABLE Users (
    id VARCHAR NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
);

CREATE TABLE Images (
    id VARCHAR NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    image_type VARCHAR(255) NOT NULL,
    image BYTEA NOT NULL,
    project_id FOREIGN KEY REFERENCES Projects(id)
);

CREATE TABLE Projects (
    id VARCHAR NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    deadline TIMESTAMP
);

CREATE TABLE Labels (
    user_id FOREIGN KEY REFERENCES Users(id),
    image_id FOREIGN KEY REFERENCES Images(id),
    response VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, image_id)
);

CREATE TABLE Roles (
    user_id FOREIGN KEY REFERENCES Users(id),
    project_id FOREIGN KEY REFERENCES Projects(id),
    role_name VARCHAR NOT NULL CHECK (role_name IN ('owner', 'reviewer', 'labeler', 'admin')),
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE Products (
    id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE Purchases (
    id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    uid INT NOT NULL REFERENCES Users(id),
    pid INT NOT NULL REFERENCES Products(id),
    time_purchased timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
);
