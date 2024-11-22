from pydantic import BaseModel, Field
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from enum import Enum

# MongoDB setup (assuming connection string is provided elsewhere)
MONGO_URL = "mongodb+srv://jeromemagpantay247:softwareprojectmanagement@cluster0.h5rik.mongodb.net/"
client = AsyncIOMotorClient(MONGO_URL)
db = client.get_database("BizPointsTicketingSystem")
ticket_collection = db.get_collection("Tickets")

# Ticket Status Enumeration
class TicketStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    CLOSED = "Closed"

# Ticket Type Enumeration
class TicketType(str, Enum):
    TECHNICAL = "Technical"
    REWARD = "Reward"

# Ticket Model
class TicketModel(BaseModel):
    ticketID: Optional[str] = Field(default_factory=lambda: "")  # Use string instead of ObjectId
    clientID: str  # Client's unique ID
    clientFullName: str  # Full name of the client
    clientEmail: str  # Email address of the client
    ticketDate: str # Date of the ticket
    ticketSubject: str  # Subject of the ticket
    ticketDescription: str  # Description of the issue
    ticketStatus: TicketStatus = TicketStatus.OPEN  # Status of the ticket
    assignedAdmin: Optional[str] = None  # Admin assigned to the ticket
    adminResponse: Optional[str] = None  # Admin response to the ticket
    actions: Optional[str] = None  # Actions taken on the ticket
    ticketType: TicketType  # Type of the ticket
    


    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "clientID": "client123",
                "clientFullName": "John Doe",
                "clientEmail": "john.doe@example.com",
                "ticketSubject": "Login Issue",
                "ticketDescription": "Unable to login to the portal with correct credentials.",
                "ticketStatus": "Open",
                "adminResponse": "Pending review.",
                "actions": "Reset password and notify client.",
                "ticketType": "Technical"
            }
        }

# Custom Pydantic model for easier JSON serialization of TicketResponse
class TicketResponseModel(BaseModel):
    ticketID: str
    clientID: str
    clientFullName: str
    clientEmail: str
    ticketDate: str
    ticketSubject: str
    ticketDescription: str
    ticketStatus: TicketStatus
    assignedAdmin: Optional[str] = None
    adminResponse: Optional[str] = None
    actions: Optional[str] = None
    ticketType: TicketType

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "ticketID": "12345",
                "clientID": "650f66e3f1c8e2f0123a4a2b",
                "clientFullName": "John Doe",
                "clientEmail": "john.doe@example.com",
                "ticketSubject": "Login Issue",
                "ticketDescription": "Unable to login to the portal with correct credentials.",
                "ticketStatus": "Open",
                "adminResponse": "Pending review.",
                "actions": "Reset password and notify client.",
                "ticketType": "Technical"
            }
        }

# Utility function to convert MongoDB documents to TicketResponseModel
async def document_to_ticket(doc: dict) -> TicketResponseModel:
    return TicketResponseModel(
        ticketID=doc.get("ticketID", ""),
        clientID=doc.get("clientID", ""),
        clientFullName=doc.get("clientFullName", ""),
        clientEmail=doc.get("clientEmail", ""),
        ticketDate=doc.get("ticketDate", ""),
        ticketSubject=doc.get("ticketSubject", ""),
        ticketDescription=doc.get("ticketDescription", ""),
        ticketStatus=doc.get("ticketStatus", TicketStatus.OPEN),
        assignedAdmin=doc.get("assignedAdmin"),
        adminResponse=doc.get("adminResponse"),
        actions=doc.get("actions"),
        ticketType=doc.get("ticketType", TicketType.TECHNICAL),
    )
