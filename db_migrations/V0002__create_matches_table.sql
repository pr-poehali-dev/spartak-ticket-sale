CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  opp VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(10) NOT NULL,
  tour VARCHAR(50) NOT NULL,
  home BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(50) NOT NULL DEFAULT 'В продаже',
  price INTEGER NOT NULL DEFAULT 1500,
  tag VARCHAR(50) NOT NULL DEFAULT ''
);

INSERT INTO matches (opp, date, time, tour, home, status, price, tag) VALUES
  ('ЦСКА',       '28 июня', '19:00', 'Тур 1', true,  'В продаже', 1500, 'Дерби'),
  ('Зенит',      '5 июля',  '17:30', 'Тур 2', true,  'В продаже', 2200, 'Топ-матч'),
  ('Локомотив',  '12 июля', '20:00', 'Тур 3', false, 'Скоро',     1200, ''),
  ('Динамо',     '19 июля', '18:00', 'Тур 4', true,  'В продаже', 1800, 'Дерби'),
  ('Краснодар',  '26 июля', '19:30', 'Тур 5', false, 'Скоро',     1300, ''),
  ('Ростов',     '2 авг',   '16:00', 'Тур 6', true,  'В продаже', 1100, '');
