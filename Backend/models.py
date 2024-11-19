from pydantic import BaseModel
from bson import ObjectId
from typing import List, Literal


class ClientModel(BaseModel):
    clientID: str
    username: str
    email: str
    password: str
    firstName: str
    lastName: str
    ticketIDs: List[str]

class TicketModel(BaseModel):
    ticketID: str
    clientID: str
    ticketTitle: str
    ticketDescription: str
    ticketStatus: Literal['Recieved', 'Under Review', 'Resolved']
    ticketDate: str
    ticketComments: str

