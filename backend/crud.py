from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

import models
import schemas


SEED_CATEGORIES = [
    {
        "name": "Электроинструменты",
        "description": "Инструменты для сверления, резки, шлифовки и монтажных работ.",
    },
    {
        "name": "Ручной инструмент",
        "description": "Базовые инструменты для ремонта, сборки и бытовых задач.",
    },
    {
        "name": "Измерительный инструмент",
        "description": "Приборы для разметки, измерения и точной работы.",
    },
    {
        "name": "Расходные материалы",
        "description": "Оснастка и сопутствующие материалы для мастерской.",
    },
]

SEED_PRODUCTS = [
    {
        "name": "Аккумуляторная дрель",
        "description": "Дрель-шуруповерт 18 В с двумя аккумуляторами и кейсом.",
        "price": 6990,
        "stock": 12,
        "category_name": "Электроинструменты",
    },
    {
        "name": "Угловая шлифмашина",
        "description": "Компактная болгарка 900 Вт для металла и плитки.",
        "price": 5490,
        "stock": 8,
        "category_name": "Электроинструменты",
    },
    {
        "name": "Электрический лобзик",
        "description": "Лобзик с регулировкой скорости для дерева и пластика.",
        "price": 4890,
        "stock": 7,
        "category_name": "Электроинструменты",
    },
    {
        "name": "Строительный фен",
        "description": "Фен с двумя режимами температуры для демонтажа и прогрева.",
        "price": 3590,
        "stock": 6,
        "category_name": "Электроинструменты",
    },
    {
        "name": "Молоток-гвоздодер",
        "description": "Стальной молоток с прорезиненной рукояткой.",
        "price": 790,
        "stock": 20,
        "category_name": "Ручной инструмент",
    },
    {
        "name": "Набор отверток",
        "description": "Набор из 6 отверток для бытового и мастерского использования.",
        "price": 1290,
        "stock": 18,
        "category_name": "Ручной инструмент",
    },
    {
        "name": "Разводной ключ",
        "description": "Универсальный ключ с плавной регулировкой зева.",
        "price": 990,
        "stock": 15,
        "category_name": "Ручной инструмент",
    },
    {
        "name": "Пассатижи",
        "description": "Комбинированные пассатижи из хромованадиевой стали.",
        "price": 680,
        "stock": 22,
        "category_name": "Ручной инструмент",
    },
    {
        "name": "Рулетка 5 м",
        "description": "Компактная рулетка с фиксатором и ударопрочным корпусом.",
        "price": 390,
        "stock": 30,
        "category_name": "Измерительный инструмент",
    },
    {
        "name": "Лазерный уровень",
        "description": "Лазерный нивелир для ровной разметки стен и пола.",
        "price": 3290,
        "stock": 9,
        "category_name": "Измерительный инструмент",
    },
    {
        "name": "Угольник 300 мм",
        "description": "Металлический угольник для точной разметки деталей.",
        "price": 450,
        "stock": 16,
        "category_name": "Измерительный инструмент",
    },
    {
        "name": "Набор сверл по металлу",
        "description": "Комплект сверл разных диаметров для стали и алюминия.",
        "price": 890,
        "stock": 25,
        "category_name": "Расходные материалы",
    },
    {
        "name": "Отрезные диски 125 мм",
        "description": "Набор дисков для резки металла на УШМ.",
        "price": 650,
        "stock": 28,
        "category_name": "Расходные материалы",
    },
    {
        "name": "Саморезы по дереву",
        "description": "Упаковка саморезов 4.2x70 мм для монтажных работ.",
        "price": 320,
        "stock": 40,
        "category_name": "Расходные материалы",
    },
]


def seed_data(db: Session) -> None:
    if db.query(models.Category).count() == 0:
        for category_data in SEED_CATEGORIES:
            db.add(models.Category(**category_data))
        db.commit()

    if db.query(models.Product).count() == 0:
        categories = {
            category.name: category.id for category in db.query(models.Category).all()
        }
        for product_data in SEED_PRODUCTS:
            db.add(
                models.Product(
                    name=product_data["name"],
                    description=product_data["description"],
                    price=product_data["price"],
                    stock=product_data["stock"],
                    category_id=categories[product_data["category_name"]],
                )
            )
        db.commit()


def get_products(db: Session):
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .order_by(models.Product.id)
        .all()
    )


def get_product(db: Session, product_id: int):
    product = (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def add_to_cart(db: Session, item: schemas.CartItemCreate):
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if item.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds stock")

    cart_item = (
        db.query(models.CartItem)
        .filter(models.CartItem.product_id == item.product_id)
        .first()
    )
    if cart_item:
        new_quantity = cart_item.quantity + item.quantity
        if new_quantity > product.stock:
            raise HTTPException(status_code=400, detail="Requested quantity exceeds stock")
        cart_item.quantity = new_quantity
    else:
        cart_item = models.CartItem(product_id=item.product_id, quantity=item.quantity)
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)
    return (
        db.query(models.CartItem)
        .options(
            joinedload(models.CartItem.product).joinedload(models.Product.category)
        )
        .filter(models.CartItem.id == cart_item.id)
        .first()
    )


def get_cart_items(db: Session):
    return (
        db.query(models.CartItem)
        .options(
            joinedload(models.CartItem.product).joinedload(models.Product.category)
        )
        .order_by(models.CartItem.id)
        .all()
    )


def remove_cart_item(db: Session, cart_item_id: int):
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart_item)
    db.commit()


def create_order(db: Session, order_data: schemas.OrderCreate):
    cart_items = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .order_by(models.CartItem.id)
        .all()
    )
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_price = 0.0
    for cart_item in cart_items:
        if cart_item.quantity > cart_item.product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {cart_item.product.name}",
            )
        total_price += cart_item.quantity * cart_item.product.price

    order = models.Order(
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_address=order_data.customer_address,
        total_price=round(total_price, 2),
    )
    db.add(order)
    db.flush()

    for cart_item in cart_items:
        db.add(
            models.OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
            )
        )
        cart_item.product.stock -= cart_item.quantity
        db.delete(cart_item)

    db.commit()
    return (
        db.query(models.Order)
        .options(
            joinedload(models.Order.items)
            .joinedload(models.OrderItem.product)
            .joinedload(models.Product.category)
        )
        .filter(models.Order.id == order.id)
        .first()
    )
