INSERT INTO projects(project_name, img_url, project_description, quantity, price_eth, open_date_gmt, royalty_percent, active) 
VALUES 
('Silver Dreams', 
 '/images/silver-dreams.jpg', 
 'A mesmerizing collection of cosmic digital art featuring nebulas and galaxies.', 
 100, 
 '2.50', 
 '2025-11-01 12:00:00', 
 '5.00', 
 1);

SELECT * FROM projects WHERE project_name = 'Silver Dreams';
)











