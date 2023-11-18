import fastapi as _fastapi
import fastapi.security as _security
from fastapi.security import OAuth2PasswordRequestForm
import models as _models
import schemas.schemas as _schemas
import services as _services
from database import session as _db
from passlib.context import CryptContext
import fastapi as _fastapi
from database import get_db
from sqlalchemy.orm import Session
from typing import List

app = _fastapi.FastAPI()


@app.get("/api")
async def root() -> dict():
    return {"Message": "Hello in BudgetApp"}


@app.post("/api/users", tags=["user", "session"])
async def create_user(
    user: _schemas.UserCreate, _db: Session = _fastapi.Depends(get_db)
):
    db_user = await _services.get_user_by_email(user.user_email, _db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    fresh_user = await _services.create_user(user, _db)

    # created_user = await _services.get_user_by_email(user.user_email, _db)
    return await _services.create_token(fresh_user)


@app.post("/api/token", tags=["session"])
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
):
    user = await _services.authenticate_user(
        form_data.username, form_data.password, _db
    )

    if not user:
        raise _fastapi.HTTPException(status_code=402, detail="Invalid credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User, tags=["user"])
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

@app.get("/api/users/get_by_email/{email}", tags=["user", "admin"])
async def get_user_by_email(
    email:str,
    _db: Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    return await _services.get_user_by_email(email=email,_db=_db)


@app.put("/api/users/update", tags=["user"])
async def update_user(
    user_update: _schemas.UserCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    await _services.update_user(user_update, _db)

    return {"message": "Succesfully updated"}


@app.post("/api/budgets/new", tags=["budget"])
async def create_budget(
    budget: _schemas.BudgetCreate,
    _db: Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    fresh_budget = await _services.create_budget(budget, _db)
    updated_user = await _services.update_user_budget_id(
        user.user_id, fresh_budget.budget_id, _db
    )
    return {"budget": fresh_budget, "user": updated_user}


@app.put("/api/budgets/{budget_id}", tags=["budget"])
async def update_budget(
    budget_id: int,
    budget: _schemas.BudgetCreate,
    _db: Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    await _services.update_budget(budget_id, budget, _db)
    return {"message": "Succesfully updated"}


@app.put("/api/budgets/existing/{budget_id}", tags=["budget", "user"])
async def add_user_to_existing_budget(
    budget_id: int,
    budget: _schemas.ExistingBudget,
    _db: Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    authenticate = await _services.authenticate_budget(budget, _db)
    if not authenticate:
        raise _fastapi.HTTPException(status_code=402, detail="Invalid credentials")
    updated_user = await _services.update_user_budget_id(
        user.user_id, budget.budget_id, _db
    )

    return updated_user


@app.post("/api/operations", response_model=_schemas.Operation, tags=["operation"])
async def create_operation(
    operation: _schemas.OperationCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    return await _services.create_operation(user=user, _db=_db, operation=operation)


@app.get(
    "/api/operations", response_model=List[_schemas.OperationTable], tags=["operation"]
)
async def get_operations(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    return await _services.get_operations(user=user, _db=_db)


@app.get("/api/operations/{operation_id}", status_code=200, tags=["operation"])
async def get_operation(
    operation_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    return await _services.get_operation(operation_id=operation_id, user=user, _db=_db)


@app.delete("/api/operations/{operation_id}", status_code=204, tags=["operation"])
async def delete_operation(
    operation_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.delete_operation(operation_id, user, _db)

    return {"message": "Succesfully deleted"}


@app.put("/api/operations/{operation_id}", status_code=200, tags=["operation"])
async def update_operation(
    operation_id: int,
    operation: _schemas.OperationCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.update_operation(operation_id, operation, user, _db)
    return {"message": "Succesfully updated"}


@app.get("/api/budgets/summary/{budget_id}", tags=["budget"])
async def get_budget_summary(
    budget_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    return await _services.get_budget_summary(budget_id, _db)


@app.get("/api/budgets/details/{budget_id}", tags=["budget"])
async def get_budget_details(
    budget_id: int, user: _schemas.User = _fastapi.Depends(_services.get_current_user)
):
    budget_info = await _services.get_budget_info(budget_id, _db)
    budget_users = await _services.get_budget_users(budget_id, _db)

    return {"budget_info": budget_info, "budget_users": budget_users}


@app.get("/api/categories", response_model=List[_schemas.Category], tags=["category"])
async def get_categories(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    return await _services.get_categories(_db)


@app.get("/api/categories_subcategories", tags=["subcategory", "category"])
async def get_categories_and_subcategories(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    subcategories = await _services.get_subcategories(0, _db)
    categories = await _services.get_categories(_db)
    return {"categories": categories, "subcategories": subcategories}


@app.get(
    "/api/subcategories/{category_id}",
    response_model=List[_schemas.Subcategory],
    tags=["subcategory"],
)
async def get_subcategories_from_category(
    category_id: int, user: _schemas.User = _fastapi.Depends(_services.get_current_user)
):
    return await _services.get_subcategories(category_id, _db)


@app.post("/api/subcategories", tags=["subcategory"])
async def create_subcategory(
    subcategory: _schemas.SubcategoryCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
):
    return await _services.create_subcategory(subcategory, _db)


@app.get(
    "/api/reminders", response_model=List[_schemas.ReminderTable], tags=["reminder"]
)
async def get_reminders(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    return await _services.get_reminders(user, _db)


@app.get("/api/reminders/{reminder_id}", status_code=200, tags=["reminder"])
async def get_reminder(
    reminder_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    return await _services.get_reminder(reminder_id=reminder_id, user=user, _db=_db)


@app.post("/api/reminders", response_model=_schemas.Reminder, tags=["reminder"])
async def create_reminder(
    reminder: _schemas.ReminderCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    return await _services.create_reminder(user=user, _db=_db, reminder=reminder)


@app.delete("/api/reminders/{reminder_id}", status_code=204, tags=["reminder"])
async def delete_reminder(
    reminder_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.delete_reminder(reminder_id, user, _db)

    return {"message": "Succesfully deleted"}


@app.put("/api/reminders/{reminder_id}", status_code=204, tags=["reminder"])
async def update_reminder(
    reminder_id: int,
    reminder: _schemas.ReminderCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.update_reminder(reminder_id, reminder, user, _db)
    return {"message": "Succesfully updated"}

@app.put("/api/reminders/done/{reminder_id}", tags=['reminder'])
async def done_reminder(
    reminder_id:int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    reminder = await _services.set_reminder_to_next_cycle(reminder_id, user, _db)
    operation_from_reminder = _schemas.OperationCreate(
        operation_name=reminder.reminder_name,
        operation_value=reminder.reminder_value,
        operation_date=reminder.reminder_date,
        subcategory_id=reminder.subcategory_id
    )
    await _services.create_operation(user=user, _db=_db, operation=operation_from_reminder)
    
    return {"message": "Succesfully done"}

@app.delete("/api/admin/delete_user/{user_id}", tags=["admin"])
async def delete_user(
    user_id:int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.delete_user(user_id=user_id, _db=_db)
    
    return {"Message":"User deleted successfully"}

@app.put("/api/admin/detach_user/{user_id}", tags=["admin"])
async def detach_user(
    user_id:int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.detach_user(user_id=user_id, _db=_db)
    
    return {"Message":"User detached successfully"}

@app.delete("/api/admin/delete_budget/{budget_id}", tags=["admin", "budget"])
async def delete_budget(
    budget_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    _db: Session = _fastapi.Depends(get_db),
):
    await _services.delete_budget(budget_id=budget_id, _db=_db)
    
    return {"Message":"Budget deleted successfully"}