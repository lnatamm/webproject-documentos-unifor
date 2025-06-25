from fastapi import APIRouter
from models.template_models import *

api_fruits = APIRouter(prefix="/fruits", tags=["Fruits"])
memory_db = {"fruits": []}

@api_fruits.get("/", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

@api_fruits.post("/", response_model=Fruit)
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit