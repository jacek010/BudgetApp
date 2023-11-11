from fastapi import FastAPI
from routes.index import user, budget, category, subcategory, operation
from services.session import get_user_by_email
app = FastAPI()

app.include_router(user, prefix="/user")
app.include_router(budget, prefix="/budget")
app.include_router(category, prefix="/category")
app.include_router(subcategory, prefix="/subcategory")
app.include_router(operation, prefix="/operation")

@app.get('/{email}')
async def get_email(email:str):
    
    return await get_user_by_email(email)
    