from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str
    description: str | None = None


class Category(CategoryBase):
    id: int

    model_config = {"from_attributes": True}


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock: int
    category_id: int


class Product(ProductBase):
    id: int
    category: Category | None = None

    model_config = {"from_attributes": True}


class AdminProductCreate(ProductBase):
    pass


class AdminProductUpdate(ProductBase):
    pass


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartItem(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: Product

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str


class OrderItem(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float
    product: Product | None = None

    model_config = {"from_attributes": True}


class Order(BaseModel):
    id: int
    customer_name: str
    customer_phone: str
    customer_address: str
    total_price: float
    items: list[OrderItem]

    model_config = {"from_attributes": True}


class OrderSummary(BaseModel):
    id: int
    customer_name: str
    customer_phone: str
    customer_address: str
    total_price: float

    model_config = {"from_attributes": True}
