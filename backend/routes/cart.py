from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(prefix="/cart", tags=["cart"])


@router.post("", response_model=schemas.CartItem, status_code=status.HTTP_201_CREATED)
def create_cart_item(item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    return crud.add_to_cart(db, item)


@router.get("", response_model=list[schemas.CartItem])
def read_cart_items(db: Session = Depends(get_db)):
    return crud.get_cart_items(db)


@router.delete("/{cart_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(cart_item_id: int, db: Session = Depends(get_db)):
    crud.remove_cart_item(db, cart_item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
