from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models import TicketModel, TicketResponseModel, TicketStatus, ticket_collection, document_to_ticket
import uuid

# Router setup
router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
    responses={404: {"description": "Ticket does not exist."}},
)

@router.get("/", response_model=List[TicketResponseModel])
async def get_all_tickets():
    tickets = []
    cursor = ticket_collection.find()
    async for ticket in cursor:
        tickets.append(await document_to_ticket(ticket))
    return tickets

@router.get("/{ticket_id}", response_model=TicketResponseModel)
async def get_ticket(ticket_id: str):
    ticket = await ticket_collection.find_one({"ticketID": ticket_id})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return await document_to_ticket(ticket)

@router.get("/{user_id}", response_model=TicketResponseModel)
async def get_user_ticket(user_id: str):
    ticket = await ticket_collection.find({"clientEmail": user_id})
    if not ticket:
        raise HTTPException(status_code=404, detail="Tickets not found")
    return await document_to_ticket(ticket)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TicketResponseModel)
async def create_ticket(ticket: TicketModel):
    # Set ticketID to a unique UUID
    ticket_dict = ticket.dict(exclude={"ticketID", "ticketStatus", "adminResponse", "actions"})
    ticket_dict["ticketID"] = str(uuid.uuid4())
    ticket_dict["ticketStatus"] = "Open"  # Set default status to Open

    # Insert into MongoDB
    result = await ticket_collection.insert_one(ticket_dict)
    if result.inserted_id is None:
        raise HTTPException(status_code=500, detail="Ticket could not be created.")

    return await document_to_ticket(ticket_dict)

@router.put("/{ticket_id}", response_model=TicketResponseModel)
async def update_ticket(ticket_id: str, ticket: TicketModel):
    ticket_dict = ticket.dict(exclude_unset=True, exclude={"ticketID"})
    result = await ticket_collection.update_one({"ticketID": ticket_id}, {"$set": ticket_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    updated_ticket = await ticket_collection.find_one({"ticketID": ticket_id})
    return await document_to_ticket(updated_ticket)

@router.put("/{ticket_id}/status", response_model=TicketResponseModel)
async def update_ticket_status(ticket_id: str, status: TicketStatus):
    result = await ticket_collection.update_one({"ticketID": ticket_id}, {"$set": {"ticketStatus": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    updated_ticket = await ticket_collection.find_one({"ticketID": ticket_id})
    return await document_to_ticket(updated_ticket)

@router.put("/{ticket_id}/assign", response_model=TicketResponseModel)
async def assign_ticket_admin(ticket_id: str, assigned_admin: str):
    result = await ticket_collection.update_one({"ticketID": ticket_id}, {"$set": {"assignedAdmin": assigned_admin}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    updated_ticket = await ticket_collection.find_one({"ticketID": ticket_id})
    return await document_to_ticket(updated_ticket)

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(ticket_id: str):
    result = await ticket_collection.delete_one({"ticketID": ticket_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return None
