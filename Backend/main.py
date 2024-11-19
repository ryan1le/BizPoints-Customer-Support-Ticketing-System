from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Literal
from bson import ObjectId
import os
from models import ClientModel, TicketModel
import motor.motor_asyncio

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://jeromemagpantay247:9E9doeUpgajrh7i7@cluster0.h5rik.mongodb.net/')
database = client.BizPointsTicketingSystem
client_collection = database.Clients
ticket_collection = database.Tickets


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI app connected to MongoDB"}

@app.get("/clients/", response_model=List[ClientModel])
async def get_clients():
    clients = await client_collection.find({"type": "client"}).to_list(1000)
    if not clients:
        raise HTTPException(status_code=404, detail="No clients found")
    return clients

@app.get("/tickets/", response_model=List[TicketModel])
async def get_tickets():
    tickets = await ticket_collection.find({"type": "ticket"}).to_list(1000)
    if not tickets:
        raise HTTPException(status_code=404, detail="No tickets found")
    return tickets