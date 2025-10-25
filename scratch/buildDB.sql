-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nft_gallery;
USE nft_gallery;

-- Drop table if exists to start fresh
DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
project_name VARCHAR(150) NOT NULL,
img_url VARCHAR(250) NOT NULL,
project_description VARCHAR(2500) NOT NULL,
quantity INTEGER NOT NULL,
price_eth DECIMAL(10, 2) NOT NULL,
open_date_gmt DATETIME NOT NULL,
royalty_percent DECIMAL(5, 2) NOT NULL,
active BOOLEAN NOT NULL,
PRIMARY KEY (id)
);
INSERT INTO projects (
project_name,
img_url,
project_description,
quantity,
price_eth,
open_date_gmt,
royalty_percent,
active
)
VALUES (
"Project 1",
"./public/images/satellite.jpg",
"This is a short description of the first project. It is a really good
project. It is made by a really good artist. It is really good work. It has good
code. It has good visuals. And it has heart and soul.",
25,
1.0,
"2024-02-01 09:00:00",
7,
0
),
(
"Project 2",
"./public/images/diffReact.png",
"This is a short description of the second project. It is a really good
project. It is made by a really good artist. It is really good work. It has good
code. It has good visuals. And it has heart and soul.",
64,
1.5,
"2023-12-15 07:30:00",
5,
0
),
(
"Project 3",
"./public/images/purpleOrangeWidget.png",
"This is a short description of the third project. It is a really good
project. It is made by a really good artist. It is really good work. It has good
code. It has good visuals. And it has heart and soul.",
512,
2.0,
"2024-03-19 05:00:00",
2,
0
);
