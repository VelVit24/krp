from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import crud
import models
from database import Base, SessionLocal, engine
from routes import admin, cart, orders, products


app = FastAPI(title="Tool Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        crud.seed_data(db)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Tool Store API"}


app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)
