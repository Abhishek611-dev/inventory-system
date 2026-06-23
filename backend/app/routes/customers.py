from fastapi import APIRouter, Depends, HTTPException
from ..database import SessionLocal
from ..models import Customer
from ..schemas import CustomerCreate

router = APIRouter(prefix="/customers")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_customers(db=Depends(get_db)):
    return db.query(Customer).all()

@router.get("/{customer_id}")
def get_customer(customer_id: int, db=Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.post("/", status_code=201)
def create_customer(customer: CustomerCreate, db=Depends(get_db)):
    existing = db.query(Customer).filter(Customer.email == customer.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Customer with this email already exists")
    new_customer = Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db=Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted"}
