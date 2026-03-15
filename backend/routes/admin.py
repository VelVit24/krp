from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session, joinedload

import models
import schemas
from database import get_db


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/products", response_model=list[schemas.Product])
def read_admin_products(db: Session = Depends(get_db)):
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .order_by(models.Product.id)
        .all()
    )


@router.post(
    "/products",
    response_model=schemas.Product,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_product(
    product: schemas.AdminProductCreate,
    db: Session = Depends(get_db),
):
    category = db.query(models.Category).filter(models.Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.id == db_product.id)
        .first()
    )


@router.put("/products/{product_id}", response_model=schemas.Product)
def update_admin_product(
    product_id: int,
    product: schemas.AdminProductUpdate,
    db: Session = Depends(get_db),
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    category = db.query(models.Category).filter(models.Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    for field, value in product.model_dump().items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.id == db_product.id)
        .first()
    )


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_product(product_id: int, db: Session = Depends(get_db)):
    db_product = (
        db.query(models.Product)
        .options(joinedload(models.Product.cart_items), joinedload(models.Product.order_items))
        .filter(models.Product.id == product_id)
        .first()
    )
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if db_product.order_items:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a product that is already part of an order",
        )

    db.delete(db_product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/orders", response_model=list[schemas.OrderSummary])
def read_admin_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()


@router.get("/orders/{order_id}", response_model=schemas.Order)
def read_admin_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.items)
            .joinedload(models.OrderItem.product)
            .joinedload(models.Product.category)
        )
        .filter(models.Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
