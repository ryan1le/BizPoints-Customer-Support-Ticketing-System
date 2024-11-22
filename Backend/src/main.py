from fastapi import FastAPI
from routes import tickets

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(tickets.router)
