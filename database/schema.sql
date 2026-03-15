PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    total_price REAL NOT NULL
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO categories (name, description) VALUES
('Электроинструменты', 'Инструменты для сверления, резки, шлифовки и монтажных работ.'),
('Ручной инструмент', 'Базовые инструменты для ремонта, сборки и бытовых задач.'),
('Измерительный инструмент', 'Приборы для разметки, измерения и точной работы.'),
('Расходные материалы', 'Оснастка и сопутствующие материалы для мастерской.');

INSERT INTO products (name, description, price, stock, category_id) VALUES
('Аккумуляторная дрель', 'Дрель-шуруповерт 18 В с двумя аккумуляторами и кейсом.', 6990, 12, 1),
('Угловая шлифмашина', 'Компактная болгарка 900 Вт для металла и плитки.', 5490, 8, 1),
('Электрический лобзик', 'Лобзик с регулировкой скорости для дерева и пластика.', 4890, 7, 1),
('Строительный фен', 'Фен с двумя режимами температуры для демонтажа и прогрева.', 3590, 6, 1),
('Молоток-гвоздодер', 'Стальной молоток с прорезиненной рукояткой.', 790, 20, 2),
('Набор отверток', 'Набор из 6 отверток для бытового и мастерского использования.', 1290, 18, 2),
('Разводной ключ', 'Универсальный ключ с плавной регулировкой зева.', 990, 15, 2),
('Пассатижи', 'Комбинированные пассатижи из хромованадиевой стали.', 680, 22, 2),
('Рулетка 5 м', 'Компактная рулетка с фиксатором и ударопрочным корпусом.', 390, 30, 3),
('Лазерный уровень', 'Лазерный нивелир для ровной разметки стен и пола.', 3290, 9, 3),
('Угольник 300 мм', 'Металлический угольник для точной разметки деталей.', 450, 16, 3),
('Набор сверл по металлу', 'Комплект сверл разных диаметров для стали и алюминия.', 890, 25, 4),
('Отрезные диски 125 мм', 'Набор дисков для резки металла на УШМ.', 650, 28, 4),
('Саморезы по дереву', 'Упаковка саморезов 4.2x70 мм для монтажных работ.', 320, 40, 4);
