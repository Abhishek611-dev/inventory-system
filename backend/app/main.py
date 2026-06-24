from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import products, customers, orders

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://inventory-system-seven-flax.vercel.app",
        "https://inventory-system-h32ljesfo-abhishek611-devs-projects.vercel.app",
    ],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)