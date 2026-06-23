from fastapi import APIRouter, Depends, HTTPException
from ..database import SessionLocal
from ..models import Product, Customer, Order
from ..schemas import OrderCreate

router = APIRouter(prefix="/orders")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_orders(db=Depends(get_db)):
    return db.query(Order).all()

@router.get("/{order_id}")
def get_order(order_id: int, db=Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", status_code=201)
def create_order(order: OrderCreate, db=Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.quantity < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    total_amount = product.price * order.quantity
    product.quantity -= order.quantity

    new_order = Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_amount=total_amount,
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.delete("/{order_id}")
def delete_order(order_id: int, db=Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Restore stock when order is cancelled
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if product:
        product.quantity += order.quantity

    db.delete(order)
    db.commit()
    return {"message": "Order cancelled"}
