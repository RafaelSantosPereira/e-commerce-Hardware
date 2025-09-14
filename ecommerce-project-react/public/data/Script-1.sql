	CREATE TABLE product (
	  id SERIAL PRIMARY KEY,
	  name TEXT NOT NULL,
	  category_id INTEGER REFERENCES categories(id),
	  price NUMERIC(10, 2) NOT NULL,
	  stock INT NOT NULL,
	  image_url TEXT,
	         
	);
	CREATE TABLE product_specs (
	  id SERIAL PRIMARY KEY,
	  product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
	  spec_key TEXT NOT NULL,
	  spec_value TEXT NOT NULL
	);
	
	ALTER TABLE product ADD COLUMN description TEXT;
	
	ALTER TABLE product ADD COLUMN brand TEXT;
	UPDATE product SET brand = 'AMD' WHERE name ILIKE 'AMD%';
	UPDATE product SET brand = 'Intel' WHERE name ILIKE 'Intel%';
	
	select * from cart_items ci 
	
	CREATE TABLE categories (
	  id SERIAL PRIMARY KEY,
	  name TEXT UNIQUE NOT NULL
	);
	
	select * from categories c 
	ALTER TABLE product
	  ADD COLUMN category_id INTEGER REFERENCES categories(id),
	  DROP COLUMN category;
	
	CREATE TABLE users (
	  id SERIAL PRIMARY KEY,
	  name TEXT NOT NULL,
	  role TEXT DEFAULT 'customer', 
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE user_auth (
	  id SERIAL PRIMARY KEY,
	  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	  email TEXT UNIQUE NOT NULL,
	  password_hash TEXT NOT null,
	  is_verified BOOLEAN DEFAULT FALSE,
	  verify_token TEXT,
	  verify_token_expires TIMESTAMP,
	  last_login TIMESTAMP;
	  
	);
	
	CREATE TABLE cart_items (
	  id SERIAL PRIMARY KEY,
	  user_id INT REFERENCES user_auth(id) ON DELETE CASCADE,
	  product_id INT NOT NULL,
	  quantity INT NOT NULL DEFAULT 1,
	  created_at TIMESTAMP DEFAULT NOW()
	);
		
	select * from cart_items ci 
	
	CREATE TABLE orders (
	  id SERIAL PRIMARY KEY,
	  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	  total_price NUMERIC(10, 2) NOT NULL,
	  status TEXT DEFAULT 'pending',  
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE order_items (
	  id SERIAL PRIMARY KEY,
	  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
	  product_id INTEGER REFERENCES product(id),
	  quantity INTEGER NOT NULL,
	  unit_price NUMERIC(10, 2) NOT NULL
	);
	
	CREATE TABLE product_reviews (
	  id SERIAL PRIMARY KEY,
	  user_id INTEGER REFERENCES users(id),
	  product_id INTEGER REFERENCES product(id),
	  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
	  comment TEXT,
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	

	select * from categories c  
	
	-- índice para acelerar buscas pelo token de verificação
	CREATE INDEX idx_user_auth_verify_token ON user_auth(verify_token);
		
	INSERT INTO categories (name) VALUES
	('Processadores'),
	('Placas Gráficas'),
	('Motherboards'),
	('Memórias RAM'),
	('Armazenamento'),
	('Fontes de Alimentação'),
	('Caixas'),
	('Coolers');
	
	select * from product p where p.category_id = 4
	
INSERT INTO product (name, category_id, price, stock, brand, description, image_url) VALUES
('TeamGroup T-Force Vulcan Z 16GB (1x16GB) DDR4-3200', 4, 69.99, 35, 'TeamGroup', 'Memória DDR4 com excelente custo-benefício e dissipador cinza', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617674/Team_Group_T-Force_Vulcan_Z_16gb_DDR4_3200Mhz_cek8us.webp'),
('Kingston Fury Renegade 32GB (2x16GB) DDR5-6400', 4, 299.99, 11, 'Kingston', 'Memória DDR5 extrema para overclockers avançados', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617674/Kingston_Fury_Renegade_32GB_DDR5-6400_ksa1om.webp'),
('G.Skill Trident Z5 32GB (2x16GB) DDR5-6000', 4, 249.99, 12, 'G.Skill', 'Kit DDR5 de alta frequência para enthusiasts', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617672/G.Skill_Trident_Z5_16GB_DDR5-6000_tvzrhi.webp'),
('G.Skill Trident Z Neo 16GB (2x8GB) DDR4-3600', 4, 119.99, 20, 'G.Skill', 'Kit otimizado para processadores AMD Ryzen com RGB', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617672/G.Skill_Trident_Z_Neo_16GB_DDR4-3600_drzvou.webp'),
('G.Skill Ripjaws S5 32GB (1x32GB) DDR5-5200', 4, 219.99, 18, 'G.Skill', 'Memória DDR5 gaming otimizada para Intel 12ª geração e superior', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617671/G.Skill_Ripjaws_S5_16GB_DDR5-5200_ek17fb.webp'),
('Crucial Ballistix 32GB (2x16GB) DDR4-3600', 4, 149.99, 22, 'Crucial', 'Kit de alta performance para enthusiasts e overclockers', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617669/crucial-ballistix-ddr4-3600mhz-pc-28800-32gb-2x16gb-cl16_p8ychg.webp'),
('Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200', 4, 89.99, 25, 'Corsair', 'Kit de memória DDR4 de alto desempenho com dissipador de calor baixo perfil', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617668/corsair-vengeance-lpx-ddr4-3200-pc4-25600-16gb-2x8gb-cl16-negro_ph5fn9.webp'),
('Corsair Vengeance RGB 64GB (4x16GB) DDR5-5600', 4, 459.99, 7, 'Corsair', 'Kit DDR5 premium com RGB dinâmico e alta frequência', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617668/corsair-memoria-ram-cmh64gx5m4b5600z36-vengance-rgb-64gb-4x16gb-ddr5-5600mhz_nwvpl5.webp'),
('Corsair Dominator Platinum RGB 16GB (2x8GB) DDR4-3200', 4, 279.99, 12, 'Corsair', 'Memória premium com iluminação RGB e construção de alta qualidade', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617667/Corsair_Dominator_Platinum_RGB_16GB_DDR4-3200_ephaw5.webp'),
('ADATA XPG Lancer RGB 32GB (2x16GB) DDR5-5200', 4, 219.99, 18, 'ADATA', 'Memória DDR5 gaming com dissipador eficiente', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617667/adata_xpg_lancer_rgb_32gb_2_x_16gb_ddr5_5200mhz_memory_ac48953_4_ydddiz.webp'),
('ADATA XPG Spectrix D60G 32GB (2x16GB) DDR4-3600', 4, 189.99, 15, 'ADATA', 'Kit com iluminação RGB única e design gaming agressivo', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617665/1791-xpg-spectrix-d60g-ddr4-3600mhz-32gb-2x16gb-cl18_iy6t0d.webp'),
('Kingston Fury Renegade RGB White 32GB (2x16GB) DDR5-6400', 4, 309.99, 10, 'Kingston', 'Memória DDR5 extrema com iluminação RGB branca', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617664/1697-kingston-fury-renegade-rgb-white-ddr5-6400mhz-32gb-cl32_lidtjm.webp'),
('ADATA XPG Spectrix D60G 16GB (1x16GB) DDR4-3200', 4, 94.99, 20, 'ADATA', 'Módulo DDR4 com iluminação RGB e design Titanium Gray', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617664/1770-adata-xpg-spectrix-d60g-ddr4-3200mhz-pc4-25600-16gb-cl14_tuc4ev.webp'),
('Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5-5600', 4, 449.99, 8, 'Corsair', 'Memória DDR5 premium com RGB e performance excepcional', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617663/1136-corsair-dominator-platinum-rgb-ddr5-5600mhz-32gb-2x16gb-cl36-optimizado-amd_w16pkq.webp'),
('G.Skill Ripjaws V 32GB (2x16GB) DDR4-3600', 4, 159.99, 18, 'G.Skill', 'Kit de 2x16GB DDR4-3600 com timings otimizados para gaming', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617663/1104-gskill-ripjaws-v-ddr4-3600mhz-pc-28800-32gb-2x16gb-cl16_wyxmvz.webp'),
('TeamGroup T-Force Delta RGB 64GB (2x32GB) DDR5-6000', 4, 419.99, 9, 'TeamGroup', 'Kit DDR5 com RGB espetacular e alta performance', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617662/182-team-group-t-force-delta-rgb-white-ddr5-6000mhz-64gb-2x32gb-cl38_mpacam.webp'),
('ADATA XPG Spectrix 16GB (1x16GB) DDR4-3200 Titanium Gray', 4, 94.99, 20, 'ADATA', 'Módulo DDR4 RGB em Titanium Gray', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617662/16GB_DDR4_3200_MEMORIA_RAM_1x16GB_CL16_ADATA_XPG_RGB_SPECTRIX_TITANIUM_GRAY_tnrx5z.webp'),
('Corsair Vengeance RGB Pro 16GB (2x8GB) DDR4-3200', 4, 109.99, 28, 'Corsair', 'Memória com RGB dinâmico e software iCUE compatível', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617661/--_Corsair_Vengeance_RGB_Pro_16GB_DDR4-3200_jmwiar.webp'),
('Kingston HyperX Predator 32GB (2x16GB) DDR4-3200', 4, 169.99, 16, 'Kingston', 'Kit de alta performance com dissipador agressivo', 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1757617661/1-ram-HX432C16PB3AK2-32-kingston-songphuong.vn_-e1606725834463.jpg_nq18du.webp');






-- Specs para cada produto RAM
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
-- 60 - TeamGroup T-Force Vulcan Z 16GB (1x16GB) DDR4-3200
(60, 'Tipo', 'DDR4'),
(60, 'Capacidade', '16GB (1x16GB)'),
(60, 'Frequência', '3200 MHz'),
(60, 'Latência', 'CL16'),
(60, 'Voltagem', '1.35V'),
(60, 'Perfil', 'XMP 2.0'),
(60, 'RGB', 'Não'),

-- 61 - Kingston Fury Renegade 32GB (2x16GB) DDR5-6400
(61, 'Tipo', 'DDR5'),
(61, 'Capacidade', '32GB (2x16GB)'),
(61, 'Frequência', '6400 MHz'),
(61, 'Latência', 'CL32'),
(61, 'Voltagem', '1.4V'),
(61, 'Perfil', 'XMP 3.0'),
(61, 'RGB', 'Não'),

-- 62 - G.Skill Trident Z5 32GB (2x16GB) DDR5-6000
(62, 'Tipo', 'DDR5'),
(62, 'Capacidade', '32GB (2x16GB)'),
(62, 'Frequência', '6000 MHz'),
(62, 'Latência', 'CL36'),
(62, 'Voltagem', '1.35V'),
(62, 'Perfil', 'XMP 3.0'),
(62, 'RGB', 'Sim'),

-- 63 - G.Skill Trident Z Neo 16GB (2x8GB) DDR4-3600
(63, 'Tipo', 'DDR4'),
(63, 'Capacidade', '16GB (2x8GB)'),
(63, 'Frequência', '3600 MHz'),
(63, 'Latência', 'CL16'),
(63, 'Voltagem', '1.35V'),
(63, 'Perfil', 'XMP 2.0'),
(63, 'RGB', 'Sim'),

-- 64 - G.Skill Ripjaws S5 32GB (2x16GB) DDR5-5200
(64, 'Tipo', 'DDR5'),
(64, 'Capacidade', '32GB (1x32GB)'),
(64, 'Frequência', '5200 MHz'),
(64, 'Latência', 'CL40'),
(64, 'Voltagem', '1.25V'),
(64, 'Perfil', 'XMP 3.0'),
(64, 'RGB', 'Não'),

-- 65 - Crucial Ballistix 32GB (2x16GB) DDR4-3600
(65, 'Tipo', 'DDR4'),
(65, 'Capacidade', '32GB (2x16GB)'),
(65, 'Frequência', '3600 MHz'),
(65, 'Latência', 'CL16'),
(65, 'Voltagem', '1.35V'),
(65, 'Perfil', 'XMP 2.0'),
(65, 'RGB', 'Sim'),

-- 66 - Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200
(66, 'Tipo', 'DDR4'),
(66, 'Capacidade', '16GB (2x8GB)'),
(66, 'Frequência', '3200 MHz'),
(66, 'Latência', 'CL16'),
(66, 'Voltagem', '1.35V'),
(66, 'Perfil', 'XMP 2.0'),
(66, 'RGB', 'Não'),

-- 67 - Corsair Vengeance RGB 64GB (4x16GB) DDR5-5600
(67, 'Tipo', 'DDR5'),
(67, 'Capacidade', '64GB (4x16GB)'),
(67, 'Frequência', '5600 MHz'),
(67, 'Latência', 'CL36'),
(67, 'Voltagem', '1.25V'),
(67, 'Perfil', 'XMP 3.0'),
(67, 'RGB', 'Sim'),

-- 68 - Corsair Dominator Platinum RGB 16GB (2x8GB) DDR4-3200
(68, 'Tipo', 'DDR4'),
(68, 'Capacidade', '16GB (2x8GB)'),
(68, 'Frequência', '3200 MHz'),
(68, 'Latência', 'CL16'),
(68, 'Voltagem', '1.35V'),
(68, 'Perfil', 'XMP 2.0'),
(68, 'RGB', 'Sim'),

-- 69 - ADATA XPG Lancer RGB 32GB (2x16GB) DDR5-5200
(69, 'Tipo', 'DDR5'),
(69, 'Capacidade', '32GB (2x16GB)'),
(69, 'Frequência', '5200 MHz'),
(69, 'Latência', 'CL38'),
(69, 'Voltagem', '1.25V'),
(69, 'Perfil', 'XMP 3.0'),
(69, 'RGB', 'Sim'),

-- 70 - ADATA XPG Spectrix D60G 32GB (2x16GB) DDR4-3600
(70, 'Tipo', 'DDR4'),
(70, 'Capacidade', '32GB (2x16GB)'),
(70, 'Frequência', '3600 MHz'),
(70, 'Latência', 'CL18'),
(70, 'Voltagem', '1.35V'),
(70, 'Perfil', 'XMP 2.0'),
(70, 'RGB', 'Sim'),

-- 71 - Kingston Fury Renegade RGB White 32GB (2x16GB) DDR5-6400
(71, 'Tipo', 'DDR5'),
(71, 'Capacidade', '32GB (2x16GB)'),
(71, 'Frequência', '6400 MHz'),
(71, 'Latência', 'CL32'),
(71, 'Voltagem', '1.4V'),
(71, 'Perfil', 'XMP 3.0'),
(71, 'RGB', 'Sim'),

-- 72 - ADATA XPG Spectrix D60G 16GB (1x16GB) DDR4-3200
(72, 'Tipo', 'DDR4'),
(72, 'Capacidade', '16GB (1x16GB)'),
(72, 'Frequência', '3200 MHz'),
(72, 'Latência', 'CL14'),
(72, 'Voltagem', '1.35V'),
(72, 'Perfil', 'XMP 2.0'),
(72, 'RGB', 'Sim'),

-- 73 - Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5-5600
(73, 'Tipo', 'DDR5'),
(73, 'Capacidade', '32GB (2x16GB)'),
(73, 'Frequência', '5600 MHz'),
(73, 'Latência', 'CL36'),
(73, 'Voltagem', '1.25V'),
(73, 'Perfil', 'XMP 3.0'),
(73, 'RGB', 'Sim'),

-- 74 - G.Skill Ripjaws V 32GB (2x16GB) DDR4-3600
(74, 'Tipo', 'DDR4'),
(74, 'Capacidade', '32GB (2x16GB)'),
(74, 'Frequência', '3600 MHz'),
(74, 'Latência', 'CL16'),
(74, 'Voltagem', '1.35V'),
(74, 'Perfil', 'XMP 2.0'),
(74, 'RGB', 'Não'),

-- 75 - TeamGroup T-Force Delta RGB 64GB (2x32GB) DDR5-6000
(75, 'Tipo', 'DDR5'),
(75, 'Capacidade', '64GB (2x32GB)'),
(75, 'Frequência', '6000 MHz'),
(75, 'Latência', 'CL38'),
(75, 'Voltagem', '1.35V'),
(75, 'Perfil', 'XMP 3.0'),
(75, 'RGB', 'Sim'),

-- 76 - ADATA XPG Spectrix 16GB (1x16GB) DDR4-3200 Titanium Gray
(76, 'Tipo', 'DDR4'),
(76, 'Capacidade', '16GB (1x16GB)'),
(76, 'Frequência', '3200 MHz'),
(76, 'Latência', 'CL16'),
(76, 'Voltagem', '1.35V'),
(76, 'Perfil', 'XMP 2.0'),
(76, 'RGB', 'Sim'),
(76, 'Cor', 'Titanium Gray'),

-- 77 - Corsair Vengeance RGB Pro 16GB (2x8GB) DDR4-3200
(77, 'Tipo', 'DDR4'),
(77, 'Capacidade', '16GB (2x8GB)'),
(77, 'Frequência', '3200 MHz'),
(77, 'Latência', 'CL16'),
(77, 'Voltagem', '1.35V'),
(77, 'Perfil', 'XMP 2.0'),
(77, 'RGB', 'Sim'),

-- 78 - Kingston HyperX Predator 32GB (2x16GB) DDR4-3200
(78, 'Tipo', 'DDR4'),
(78, 'Capacidade', '32GB (2x16GB)'),
(78, 'Frequência', '3200 MHz'),
(78, 'Latência', 'CL16'),
(78, 'Voltagem', '1.35V'),
(78, 'Perfil', 'XMP 2.0'),
(78, 'RGB', 'Não');



	
	INSERT INTO product (name, category_id, price, stock)
	VALUES 
	('AMD Ryzen 7 9800X3D', 1, 451.50, 100),
	('AMD Ryzen 7 7800X3D', 1, 340.05, 100),
	('AMD Ryzen 5 7600X', 1, 170.49, 100),
	('AMD Ryzen 5 9600X', 1, 204.99, 100),
	('AMD Ryzen 7 7700X', 1, 242.98, 100),
	('AMD Ryzen 9 9950X3D', 1, 649.99, 100),
	('AMD Ryzen 5 5500', 1, 74.22, 100),
	('AMD Ryzen 7 9700X', 1, 305.89, 100),
	('AMD Ryzen 5 5600X', 1, 158.99, 100),
	('AMD Ryzen 5 5600', 1, 125.61, 100),
	('AMD Ryzen 7 5800X', 1, 179.95, 100),
	('Intel Core i7-14700K', 1, 297.17, 100),
	('Intel Core i9-14900K', 1, 439.00, 100),
	('Intel Core i5-12400F', 1, 108.99, 100),
	('AMD Ryzen 5 3600', 1, 79.75, 100),
	('AMD Ryzen 5 7600', 1, 196.97, 100),
	('AMD Ryzen 7 5700X', 1, 154.99, 100);
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521923/Intel_Core_i9-14900K_uj3flu.webp'
	WHERE name = 'Intel Core i9-14900K';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521923/Intel_Core_i7-14700K_r1o2gj.webp'
	WHERE name = 'Intel Core i7-14700K';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521923/Intel_Core_i5-12400F_z7iwmk.webp'
	WHERE name = 'Intel Core i5-12400F';
	
	-- AMD
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521922/AMD_Ryzen_9_9950X3D_dltcnc.webp'
	WHERE name = 'AMD Ryzen 9 9950X3D';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521922/AMD_Ryzen_7_9800X3D_kcqfwh.webp'
	WHERE name = 'AMD Ryzen 7 9800X3D';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521921/AMD_Ryzen_7_9700X_o9dmjz.webp'
	WHERE name = 'AMD Ryzen 7 9700X';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_7_7800X3D_zwslow.webp'
	WHERE name = 'AMD Ryzen 7 7800X3D';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_7_7700X_lrv3za.webp'
	WHERE name = 'AMD Ryzen 7 7700X';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_5_7600Xwebp_up1hsg.webp'
	WHERE name IN ('AMD Ryzen 5 7600X', 'AMD Ryzen 5 7600'); -- mesma imagem
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_5_3600_navbhe.webp'
	WHERE name = 'AMD Ryzen 5 3600';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_5_5500_sny5hj.webp'
	WHERE name = 'AMD Ryzen 5 5500';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_5_9600X_alrfb6.webp'
	WHERE name = 'AMD Ryzen 5 9600X';
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/168-amd-ryzen-7-5800x-38ghz_zideen.webp'
	WHERE name = 'AMD Ryzen 7 5800X';
	
	-- Produtos que não têm imagem específica (ex: Ryzen 5 5600, 5600X, 5700X) podem herdar imagens semelhantes
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/AMD_Ryzen_5_5500_sny5hj.webp'
	WHERE name IN ('AMD Ryzen 5 5600', 'AMD Ryzen 5 5600X');
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754521920/168-amd-ryzen-7-5800x-38ghz_zideen.webp'
	WHERE name = 'AMD Ryzen 7 5700X';
	
	select * from product p 
	
	
	-- Produto 1
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(1, 'core count', '8'),
	(1, 'core clock', '4.7'),
	(1, 'boost clock', '5.2'),
	(1, 'microarchitecture', 'Zen 5'),
	(1, 'tdp', '120'),
	(1, 'graphics', 'Radeon');
	
	-- Produto 2
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(2, 'core count', '8'),
	(2, 'core clock', '4.2'),
	(2, 'boost_clock', '5.0'),
	(2, 'microarchitecture', 'Zen 4'),
	(2, 'tdp', '120'),
	(2, 'graphics', 'Radeon');
	
	-- Produto 3
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(3, 'core count', '6'),
	(3, 'core clock', '4.7'),
	(3, 'boost_clock', '5.3'),
	(3, 'microarchitecture', 'Zen 4'),
	(3, 'tdp', '105'),
	(3, 'graphics', 'Radeon');
	
	-- Produto 4
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(4, 'core count', '6'),
	(4, 'core clock', '3.9'),
	(4, 'boost clock', '5.4'),
	(4, 'microarchitecture', 'Zen 5'),
	(4, 'tdp', '65'),
	(4, 'graphics', 'Radeon');
	
	-- Produto 5
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(5, 'core count', '8'),
	(5, 'core clock', '4.5'),
	(5, 'boost clock', '5.4'),
	(5, 'microarchitecture', 'Zen 4'),
	(5, 'tdp', '105'),
	(5, 'graphics', 'Radeon');
	
	-- Produto 6
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(6, 'core count', '16'),
	(6, 'core clock', '4.3'),
	(6, 'boost clock', '5.7'),
	(6, 'microarchitecture', 'Zen 5'),
	(6, 'tdp', '170'),
	(6, 'graphics', 'Radeon');
	
	-- Produto 7
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(7, 'core count', '6'),
	(7, 'core clock', '3.6'),
	(7, 'boost clock', '4.2'),
	(7, 'microarchitecture', 'Zen 3'),
	(7, 'tdp', '65');
	
	-- Produto 8
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(8, 'core count', '8'),
	(8, 'core clock', '3.8'),
	(8, 'boost clock', '5.5'),
	(8, 'microarchitecture', 'Zen 5'),
	(8, 'tdp', '65'),
	(8, 'graphics', 'Radeon');
	
	-- Produto 9
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(9, 'core count', '6'),
	(9, 'core clock', '3.7'),
	(9, 'boost clock', '4.6'),
	(9, 'microarchitecture', 'Zen 3'),
	(9, 'tdp', '65');
	
	-- Produto 10
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(10, 'core count', '6'),
	(10, 'core clock', '3.5'),
	(10, 'boost clock', '4.4'),
	(10, 'microarchitecture', 'Zen 3'),
	(10, 'tdp', '65');
	
	-- Produto 11
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(11, 'core count', '8'),
	(11, 'core clock', '3.8'),
	(11, 'boost clock', '4.7'),
	(11, 'microarchitecture', 'Zen 3'),
	(11, 'tdp', '105');
	
	-- Produto 12
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(12, 'core count', '20'),
	(12, 'core clock', '3.4'),
	(12, 'boost clock', '5.6'),
	(12, 'microarchitecture', 'Raptor Lake Refresh'),
	(12, 'tdp', '125'),
	(12, 'graphics', 'Intel UHD Graphics 770');
	
	-- Produto 13
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(13, 'core count', '24'),
	(13, 'core clock', '3.2'),
	(13, 'boost clock', '6.0'),
	(13, 'microarchitecture', 'Raptor Lake Refresh'),
	(13, 'tdp', '125'),
	(13, 'graphics', 'Intel UHD Graphics 770');
	
	-- Produto 14
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(14, 'core count', '6'),
	(14, 'core clock', '2.5'),
	(14, 'boost clock', '4.4'),
	(14, 'microarchitecture', 'Alder Lake'),
	(14, 'tdp', '65');
	
	-- Produto 15
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(15, 'core count', '6'),
	(15, 'core clock', '3.6'),
	(15, 'boost clock', '4.2'),
	(15, 'microarchitecture', 'Zen 2'),
	(15, 'tdp', '65');
	
	-- Produto 16
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(16, 'core count', '6'),
	(16, 'core clock', '3.8'),
	(16, 'boost clock', '5.1'),
	(16, 'microarchitecture', 'Zen 4'),
	(16, 'tdp', '65'),
	(16, 'graphics', 'Radeon');
	
	-- Produto 17
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(17, 'core count', '8'),
	(17, 'core clock', '3.4'),
	(17, 'boost clock', '4.6'),
	(17, 'microarchitecture', 'Zen 3'),
	(17, 'tdp', '65');
	
	-- PLACAS DE VÍDEO NVIDEA
	INSERT INTO product (name, category_id, price, stock) VALUES 
	('ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X', 2, 1699.99, 25),
	('MSI Gaming X Trio GeForce RTX 4080 SUPER 16GB GDDR6X', 2, 999.99, 40),
	('GIGABYTE AORUS GeForce RTX 4070 Ti SUPER Elite 12GB', 2, 799.99, 50),
	('ZOTAC GAMING GeForce RTX 4070 SUPER Twin Edge OC 12GB', 2, 599.99, 60),
	('PNY GeForce RTX 4070 XLR8 Gaming VERTO 12GB GDDR6X', 2, 549.99, 70),
	('ASUS Dual GeForce RTX 4060 Ti OC Edition 8GB GDDR6', 2, 399.99, 80),
	('MSI Ventus 2X GeForce RTX 4060 8GB GDDR6', 2, 299.99, 90),
	('ZOTAC GAMING GeForce RTX 3070 Twin Edge OC 8GB', 2, 479.99, 45),
	('GIGABYTE Eagle GeForce RTX 3060 Ti 8GB GDDR6', 2, 389.99, 55),
	('ASUS TUF Gaming GeForce RTX 3060 12GB GDDR6', 2, 289.99, 75);
	
	-- PLACAS DE VÍDEO AMD
	INSERT INTO product (name, category_id, price, stock) VALUES 
	('Sapphire Nitro+ AMD Radeon RX 7900 XTX 24GB GDDR6', 2, 899.99, 30),
	('PowerColor Red Devil AMD Radeon RX 7900 XT 20GB GDDR6', 2, 749.99, 35),
	('ASRock Phantom Gaming AMD Radeon RX 7800 XT 16GB', 2, 499.99, 55),
	('XFX Speedster MERC319 AMD Radeon RX 7700 XT 12GB', 2, 449.99, 65),
	('Sapphire Pulse AMD Radeon RX 7600 XT 16GB GDDR6', 2, 329.99, 70),
	('ASUS Dual Radeon RX 7600 8GB GDDR6', 2, 269.99, 85),
	('GIGABYTE Gaming OC AMD Radeon RX 6750 XT 12GB', 2, 379.99, 40),
	('PowerColor Fighter Radeon RX 6650 XT 8GB GDDR6', 2, 299.99, 50),
	('MSI Mech 2X AMD Radeon RX 6600 XT 8GB GDDR6', 2, 259.99, 60),
	('XFX Speedster SWFT210 Radeon RX 6600 8GB GDDR6', 2, 229.99, 70);
	
	UPDATE product SET brand = 'ASUS' WHERE name LIKE 'ASUS%';
	UPDATE product SET brand = 'MSI' WHERE name LIKE 'MSI%';
	UPDATE product SET brand = 'GIGABYTE' WHERE name LIKE 'GIGABYTE%';
	UPDATE product SET brand = 'ZOTAC' WHERE name LIKE 'ZOTAC%';
	UPDATE product SET brand = 'PNY' WHERE name LIKE 'PNY%';
	
	UPDATE product SET brand = 'Sapphire' WHERE name LIKE 'Sapphire%';
	UPDATE product SET brand = 'PowerColor' WHERE name LIKE 'PowerColor%';
	UPDATE product SET brand = 'ASRock' WHERE name LIKE 'ASRock%';
	UPDATE product SET brand = 'XFX' WHERE name LIKE 'XFX%';
	
	
	
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409406/asus-placa-grafica-rog-strix-oc-edition-rtx-4090-24gb-gddr6x_itczp2.webp' WHERE name = 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409405/3136408_msi-gaming-x-trio-geforce-rtx-4080-super-16gb-gddr6x-dlss3_bu9jjj.webp' WHERE name = 'MSI Gaming X Trio GeForce RTX 4080 SUPER 16GB GDDR6X';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409406/GIGABYTE_AORUS_GeForce_RTX_4070_Ti_SUPER_Elite_12GB_drgcuj.webp' WHERE name = 'GIGABYTE AORUS GeForce RTX 4070 Ti SUPER Elite 12GB';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409415/ZOTAC_GAMING_GeForce_RTX_4070_SUPER_Twin_Edge_OC_12GB_gyx3j5.webp' WHERE name = 'ZOTAC GAMING GeForce RTX 4070 SUPER Twin Edge OC 12GB';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409410/PNY_GeForce_RTX_4070_XLR8_Gaming_VERTO_12GB_GDDR6X_pt0dnh.webp' WHERE name = 'PNY GeForce RTX 4070 XLR8 Gaming VERTO 12GB GDDR6X';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409409/placa-grafica-asus-rtx-4060-ti-dual-evo-oc-8gb-gddr6-9_q7ehlp.webp' WHERE name = 'ASUS Dual GeForce RTX 4060 Ti OC Edition 8GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409409/MSI-RTX-4060-Ventus-2X-Black-OC-8GB_zv2mfr.webp' WHERE name = 'MSI Ventus 2X GeForce RTX 4060 8GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409415/ZOTAC_GAMING_GeForce_RTX_3070_Twin_Edge_OC_8GB_obuunw.webp' WHERE name = 'ZOTAC GAMING GeForce RTX 3070 Twin Edge OC 8GB';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409408/gigabyte-rtx-3060-ti-eagle-oc-lhr-8gb-gddr6x-graphic-card_lrsng2.webp' WHERE name = 'GIGABYTE Eagle GeForce RTX 3060 Ti 8GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409406/ASUS_TUF_Gaming_GeForce_RTX_3060_12GB_GDDR6_jux38o.webp' WHERE name = 'ASUS TUF Gaming GeForce RTX 3060 12GB GDDR6';
	
	-- AMD GPUs
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409413/sapphire-placa-grafica-radeon-rx-7900-xtx-gaming-oc-vapor-x-24gb-gddr6_lcdstk.webp' WHERE name = 'Sapphire Nitro+ AMD Radeon RX 7900 XTX 24GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409405/2102108_powercolor-rx-7900-xt-20g-e-oc-radeon-rx-7900-xt-20gb-gddr6-red-devil-pcie_w8psyi.webp' WHERE name = 'PowerColor Red Devil AMD Radeon RX 7900 XT 20GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409405/ASRock_Phantom_Gaming_AMD_Radeon_RX_7800_XT_16GB_dhxq2i.webp' WHERE name = 'ASRock Phantom Gaming AMD Radeon RX 7800 XT 16GB';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409413/XFX_Speedster_MERC319_AMD_Radeon_RX_7700_XT_12GB_o5vnn8.webp' WHERE name = 'XFX Speedster MERC319 AMD Radeon RX 7700 XT 12GB';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409411/Sapphire_Pulse_AMD_Radeon_RX_7600_XT_16GB_GDDR6_po1bgo.webp' WHERE name = 'Sapphire Pulse AMD Radeon RX 7600 XT 16GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409405/ASUS_Dual_Radeon_RX_7600_8GB_GDDR6_n5uoeo.webp' WHERE name = 'ASUS Dual Radeon RX 7600 8GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409407/GIGABYTE_Gaming_OC_AMD_Radeon_RX_6750_XT_12GBd_nkteec.webp' WHERE name = 'GIGABYTE Gaming OC AMD Radeon RX 6750 XT 12GB';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409411/PowerColor_Fighter_Radeon_RX_6650_XT_8GB_GDDR6_adc4s5.webp' WHERE name = 'PowerColor Fighter Radeon RX 6650 XT 8GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409408/MSI_Mech_2X_AMD_Radeon_RX_6600_XT_8GB_GDDR6e_bap8it.webp' WHERE name = 'MSI Mech 2X AMD Radeon RX 6600 XT 8GB GDDR6';
	UPDATE product SET image_url = 'https://res.cloudinary.com/dtwvymvxm/image/upload/v1754409413/XFX_Speedster_SWFT210_Radeon_RX_6600_8GB_GDDR6_ewkhqq.webp' WHERE name = 'XFX Speedster SWFT210 Radeon RX 6600 8GB GDDR6';
	
	select * from product p 
	
	
	
	-- ESPECIFICAÇÕES DAS PLACAS NVIDIA
	
	-- RTX 4090 (assumindo product_id = 18)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(18, 'gpu cores', '16384'),
	(18, 'base clock', '2230'),
	(18, 'boost clock', '2520'),
	(18, 'memory size', '24'),
	(18, 'memory type', 'GDDR6X'),
	(18, 'memory bus', '384'),
	(18, 'tdp', '450'),
	(18, 'architecture', 'Ada Lovelace'),
	(18, 'ray tracing', 'Yes'),
	(18, 'dlss', 'DLSS 3');
	
	-- RTX 4080 SUPER (product_id = 19)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(19, 'gpu cores', '10240'),
	(19, 'base clock', '2295'),
	(19, 'boost clock', '2550'),
	(19, 'memory size', '16'),
	(19, 'memory_type', 'GDDR6X'),
	(19, 'memory bus', '256'),
	(19, 'tdp', '320'),
	(19, 'architecture', 'Ada Lovelace'),
	(19, 'ray tracing', 'Yes'),
	(19, 'dlss', 'DLSS 3');
	
	-- RTX 4070 Ti SUPER (product_id = 20)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(20, 'gpu cores', '8448'),
	(20, 'base clock', '2340'),
	(20, 'boost clock', '2610'),
	(20, 'memory size', '16'),
	(20, 'memory type', 'GDDR6X'),
	(20, 'memory bus', '256'),
	(20, 'tdp', '285'),
	(20, 'architecture', 'Ada Lovelace'),
	(20, 'ray tracing', 'Yes'),
	(20, 'dlss', 'DLSS 3');
	
	-- RTX 4070 SUPER (product_id = 21)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(21, 'gpu cores', '7168'),
	(21, 'base clock', '1980'),
	(21, 'boost clock', '2475'),
	(21, 'memory size', '12'),
	(21, 'memory type', 'GDDR6X'),
	(21, 'memory bus', '192'),
	(21, 'tdp', '220'),
	(21, 'architecture', 'Ada Lovelace'),
	(21, 'ray tracing', 'Yes'),
	(21, 'dlss', 'DLSS 3');
	
	-- RTX 4070 (product_id = 22)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(22, 'gpu cores', '5888'),
	(22, 'base clock', '1920'),
	(22, 'boost clock', '2475'),
	(22, 'memory size', '12'),
	(22, 'memory type', 'GDDR6X'),
	(22, 'memory bus', '192'),
	(22, 'tdp', '200'),
	(22, 'architecture', 'Ada Lovelace'),
	(22, 'ray tracing', 'Yes'),
	(22, 'dlss', 'DLSS 3');
	
	-- RTX 4060 Ti (product_id = 23)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(23, 'gpu cores', '4352'),
	(23, 'base clock', '2310'),
	(23, 'boost clock', '2535'),
	(23, 'memory size', '16'),
	(23, 'memory type', 'GDDR6'),
	(23, 'memory bus', '128'),
	(23, 'tdp', '165'),
	(23, 'architecture', 'Ada Lovelace'),
	(23, 'ray tracing', 'Yes'),
	(23, 'dlss', 'DLSS 3');
	
	-- RTX 4060 (product_id = 24)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(24, 'gpu cores', '3072'),
	(24, 'base clock', '1830'),
	(24, 'boost clock', '2460'),
	(24, 'memory size', '8'),
	(24, 'memory type', 'GDDR6'),
	(24, 'memory bus', '128'),
	(24, 'tdp', '115'),
	(24, 'architecture', 'Ada Lovelace'),
	(24, 'ray tracing', 'Yes'),
	(24, 'dlss', 'DLSS 3');
	
	-- RTX 3070 (product_id = 25)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(25, 'gpu cores', '5888'),
	(25, 'base clock', '1500'),
	(25, 'boost clock', '1725'),
	(25, 'memory size', '8'),
	(25, 'memory type', 'GDDR6'),
	(25, 'memory bus', '256'),
	(25, 'tdp', '220'),
	(25, 'architecture', 'Ampere'),
	(25, 'ray tracing', 'Yes'),
	(25, 'dlss', 'DLSS 2');
	
	-- RTX 3060 Ti (product_id = 26)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(26, 'gpu cores', '4864'),
	(26, 'base clock', '1410'),
	(26, 'boost clock', '1665'),
	(26, 'memory size', '8'),
	(26, 'memory type', 'GDDR6'),
	(26, 'memory bus', '256'),
	(26, 'tdp', '200'),
	(26, 'architecture', 'Ampere'),
	(26, 'ray tracing', 'Yes'),
	(26, 'dlss', 'DLSS 2');
	
	-- RTX 3060 (product_id = 27)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(27, 'gpu cores', '3584'),
	(27, 'base clock', '1320'),
	(27, 'boost clock', '1777'),
	(27, 'memory size', '12'),
	(27, 'memory type', 'GDDR6'),
	(27, 'memory bus', '192'),
	(27, 'tdp', '170'),
	(27, 'architecture', 'Ampere'),
	(27, 'ray tracing', 'Yes'),
	(27, 'dlss', 'DLSS 2');
	
	-- ESPECIFICAÇÕES DAS PLACAS AMD
	
	-- RX 7900 XTX (product_id = 28)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(28, 'gpu cores', '6144'),
	(28, 'base clock', '1855'),
	(28, 'boost clock', '2500'),
	(28, 'memory size', '24'),
	(28, 'memory type', 'GDDR6'),
	(28, 'memory_bus', '384'),
	(28, 'tdp', '355'),
	(28, 'architecture', 'RDNA 3'),
	(28, 'ray tracing', 'Yes'),
	(28, 'fsr', 'FSR 3');
	
	-- RX 7900 XT (product_id = 29)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(29, 'gpu cores', '5376'),
	(29, 'base clock', '1500'),
	(29, 'boost clock', '2400'),
	(29, 'memory size', '20'),
	(29, 'memory type', 'GDDR6'),
	(29, 'memory bus', '320'),
	(29, 'tdp', '315'),
	(29, 'architecture', 'RDNA 3'),
	(29, 'ray tracing', 'Yes'),
	(29, 'fsr', 'FSR 3');
	
	-- RX 7800 XT (product_id = 30)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(30, 'gpu cores', '3840'),
	(30, 'base clock', '1295'),
	(30, 'boost clock', '2430'),
	(30, 'memory size', '16'),
	(30, 'memory type', 'GDDR6'),
	(30, 'memory bus', '256'),
	(30, 'tdp', '263'),
	(30, 'architecture', 'RDNA 3'),
	(30, 'ray tracing', 'Yes'),
	(30, 'fsr', 'FSR 3');
	
	-- RX 7700 XT (product_id = 31)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(31, 'gpu cores', '3456'),
	(31, 'base clock', '1700'),
	(31, 'boost clock', '2544'),
	(31, 'memory size', '12'),
	(31, 'memory type', 'GDDR6'),
	(31, 'memory bus', '192'),
	(31, 'tdp', '245'),
	(31, 'architecture', 'RDNA 3'),
	(31, 'ray_tracing', 'Yes'),
	(31, 'fsr', 'FSR 3');
	
	-- RX 7600 XT (product_id = 32)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(32, 'gpu cores', '2048'),
	(32, 'base_clock', '1755'),
	(32, 'boost clock', '2755'),
	(32, 'memory size', '16'),
	(32, 'memory type', 'GDDR6'),
	(32, 'memory_bus', '128'),
	(32, 'tdp', '190'),
	(32, 'architecture', 'RDNA 3'),
	(32, 'ray tracing', 'Yes'),
	(32, 'fsr', 'FSR 3');
	
	-- RX 7600 (product_id = 33)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(33, 'gpu cores', '2048'),
	(33, 'base clock', '1720'),
	(33, 'boost clock', '2655'),
	(33, 'memory size', '8'),
	(33, 'memory type', 'GDDR6'),
	(33, 'memory bus', '128'),
	(33, 'tdp', '165'),
	(33, 'architecture', 'RDNA 3'),
	(33, 'ray tracing', 'Yes'),
	(33, 'fsr', 'FSR 3');
	
	-- RX 6750 XT (product_id = 34)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(34, 'gpu cores', '2560'),
	(34, 'base clock', '2150'),
	(34, 'boost clock', '2600'),
	(34, 'memory size', '12'),
	(34, 'memory type', 'GDDR6'),
	(34, 'memory bus', '192'),
	(34, 'tdp', '250'),
	(34, 'architecture', 'RDNA 2'),
	(34, 'ray_tracing', 'Yes'),
	(34, 'fsr', 'FSR 2');
	
	-- RX 6650 XT (product_id = 35)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(35, 'gpu cores', '2048'),
	(35, 'base clock', '2055'),
	(35, 'boost clock', '2635'),
	(35, 'memory size', '8'),
	(35, 'memory type', 'GDDR6'),
	(35, 'memory bus', '128'),
	(35, 'tdp', '180'),
	(35, 'architecture', 'RDNA 2'),
	(35, 'ray tracing', 'Yes'),
	(35, 'fsr', 'FSR 2');
	
	-- RX 6600 XT (product_id = 36)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(36, 'gpu cores', '2048'),
	(36, 'base clock', '1968'),
	(36, 'boost clock', '2589'),
	(36, 'memory size', '8'),
	(36, 'memory type', 'GDDR6'),
	(36, 'memory_bus', '128'),
	(36, 'tdp', '160'),
	(36, 'architecture', 'RDNA 2'),
	(36, 'ray tracing', 'Yes'),
	(36, 'fsr', 'FSR 2');
	
	-- RX 6600 (product_id = 37)
	INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
	(37, 'gpu cores', '1792'),
	(37, 'base clock', '1626'),
	(37, 'boost clock', '2491'),
	(37, 'memory size', '8'),
	(37, 'memory type', 'GDDR6'),
	(37, 'memory bus', '128'),
	(37, 'tdp', '132'),
	(37, 'architecture', 'RDNA 2'),
	(37, 'ray tracing', 'Yes'),
	(37, 'fsr', 'FSR 2');
	
	
	DELETE FROM product_specs;
	
	-- 2. Apagar todos os produtos
	DELETE FROM product;
	
	-- 3. Reset do contador de IDs (opcional - para recomeçar do ID 1)
	-- No PostgreSQL:
	ALTER SEQUENCE product_id_seq RESTART WITH 1;
	ALTER SEQUENCE product_specs_id_seq RESTART WITH 1;
	
	-- Verificar se os produtos foram apagados
	SELECT COUNT(*) as total_produtos FROM product;
	SELECT COUNT(*) as total_specs FROM product_specs;
	
	
	
	
	
	
	
