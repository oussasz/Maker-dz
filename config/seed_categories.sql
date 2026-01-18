-- Seed categories for Maker DZ
-- Run this in phpMyAdmin or MySQL CLI for the target database

INSERT IGNORE INTO categories (name, slug, description, is_active)
VALUES
  ("Pottery & Ceramics", "pottery-ceramics", "Traditional clay work from Kabylie and beyond", TRUE),
  ("Textiles & Weaving", "textiles-weaving", "Handwoven carpets, blankets, and traditional fabrics", TRUE),
  ("Jewelry & Silver", "jewelry-silver", "Berber silver, traditional Kabyle pieces", TRUE),
  ("Leather Goods", "leather-goods", "Handcrafted bags, shoes, and accessories", TRUE),
  ("Woodwork & Carving", "woodwork-carving", "Intricate wooden art and furniture", TRUE),
  ("Traditional Dress", "traditional-dress", "Karakou, Chedda, and regional costumes", TRUE);
