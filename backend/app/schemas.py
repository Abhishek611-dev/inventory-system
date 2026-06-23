from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    quantity: int | None = None

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str

class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int
