from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
import models as _models
import schemas.schemas as _schemas
import jwt as _jwt
import fastapi as _fastapi
from database import get_db
from cryptography.fernet import Fernet
from dateutil.relativedelta import relativedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = "budget_app_secret"

with open("key.key", "rb") as key_file:
    key = key_file.read()

cipher_suite = Fernet(key)


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def encrypt_password(password: str) -> str:
    return cipher_suite.encrypt(password.encode())


def decrypt_password(encrypted_password: str) -> str:
    return cipher_suite.decrypt(encrypted_password).decode()


def verify_encrypted_password(password: str, encrypted_password: str) -> bool:
    if password == decrypt_password(encrypted_password):
        return True
    return False


async def get_user_by_email(email: str, _db: Session):
    return _db.query(_models.User).filter(_models.User.user_email == email).first()


async def create_user(user: _schemas.UserCreate, _db: Session):
    new_user = _models.User(
        user_name=user.user_name,
        user_surname=user.user_surname,
        user_email=user.user_email,
        user_hashed_password=get_hashed_password(user.user_hashed_password),
    )
    _db.add(new_user)
    _db.commit()
    _db.refresh(new_user)
    return new_user


async def update_user(user: _schemas.UserCreate, _db: Session):
    user_db = (
        _db.query(_models.User)
        .filter(_models.User.user_email == user.user_email)
        .first()
    )

    user_db.user_name = user.user_name
    user_db.user_surname = user.user_surname
    if not (verify_password(user.user_hashed_password, user_db.user_hashed_password)):
        user_db.user_hashed_password = get_hashed_password(user.user_hashed_password)

    _db.commit()
    _db.refresh(user_db)

    return user_db


async def authenticate_user(email: str, password: str, _db: Session):
    user = await get_user_by_email(email, _db)
    if not user:
        return False

    if not verify_password(password, user.user_hashed_password):
        return False

    return user


async def authenticate_budget(budget: _schemas.ExistingBudget, _db: Session) -> bool:
    budget_from_db = (
        _db.query(_models.Budget)
        .filter(_models.Budget.budget_id == budget.budget_id)
        .first()
    )
    if not budget_from_db:
        raise _fastapi.HTTPException(status_code=405, detail="No budget in db")

    if verify_encrypted_password(
        budget.budget_password, budget_from_db.budget_encrypted_password
    ):
        return True

    raise _fastapi.HTTPException(status_code=402, detail="Invalid password")


async def create_token(user: _models.User):
    user_obj = _schemas.User.model_validate(user)

    token = _jwt.encode(user_obj.model_dump(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    _db: Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2_scheme),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = _db.query(_models.User).get(payload["user_id"])
    except:
        raise _fastapi.HTTPException(
            status_code=403, detail="Invalid Email or Password"
        )

    return _schemas.User.model_validate(user)


async def create_budget(budget: _schemas.BudgetCreate, _db: Session):
    new_budget = _models.Budget(
        budget_name=budget.budget_name,
        budget_description=budget.budget_description,
        budget_encrypted_password=encrypt_password(budget.budget_password),
    )
    _db.add(new_budget)
    _db.commit()
    _db.refresh(new_budget)

    return new_budget


async def update_budget(budget_id: int, budget: _schemas.BudgetCreate, _db: Session):
    budget_db = (
        _db.query(_models.Budget).filter(_models.Budget.budget_id == budget_id).first()
    )

    budget_db.budget_name = budget.budget_name
    budget_db.budget_description = budget.budget_description
    budget_db.budget_encrypted_password = encrypt_password(budget.budget_password)

    _db.commit()
    _db.refresh(budget_db)

    return _schemas.Budget.model_validate(budget_db)


async def update_user_budget_id(user_id: int, budget_id: int, _db: Session):
    user_update = (
        _db.query(_models.User).filter(_models.User.user_id == user_id).first()
    )
    user_update.budget_id = budget_id
    _db.commit()
    _db.refresh(user_update)

    return user_update


async def create_operation(
    user: _schemas.User, _db: Session, operation: _schemas.OperationCreate
):
    operation = _models.Operation(
        **operation.model_dump(), budget_id=user.budget_id, user_id=user.user_id
    )
    _db.add(operation)
    _db.commit()
    _db.refresh(operation)

    return _schemas.Operation.model_validate(operation)


def operation_model_validate(operation):
    operation_dict = operation.__dict__
    operation_dict["user_name"] = operation.user.user_name
    operation_dict["user_surname"] = operation.user.user_surname
    operation_dict["subcategory_name"] = operation.subcategory.subcategory_name
    operation_dict["category_name"] = operation.subcategory.category.category_name
    operation_dict["category_color"] = operation.subcategory.category.category_color
    del operation_dict["_sa_instance_state"]
    return operation_dict


async def get_operations(user: _schemas.User, _db: Session):
    operations = (
        _db.query(_models.Operation)
        .options(joinedload(_models.Operation.user))
        .options(joinedload(_models.Operation.subcategory))
        .filter_by(budget_id=user.budget_id)
        .order_by(desc(_models.Operation.operation_date))
    )

    return list(map(operation_model_validate, operations))


async def _operation_selector(operation_id: int, user: _schemas.User, _db: Session):
    operation = (
        _db.query(_models.Operation)
        .filter_by(budget_id=user.budget_id)
        .filter(_models.Operation.operation_id == operation_id)
        .first()
    )

    if operation is None:
        raise _fastapi.HTTPException(status_code=404, detail="Operation doesn't exist")
    return operation


async def get_operation(operation_id: int, user: _schemas.User, _db: Session):
    operation = await _operation_selector(operation_id=operation_id, user=user, _db=_db)

    return _schemas.Operation.model_validate(operation)


async def delete_operation(operation_id: int, user: _schemas.User, _db: Session):
    operation = await _operation_selector(operation_id, user, _db)

    _db.delete(operation)
    _db.commit()


async def update_operation(
    operation_id: int,
    operation: _schemas.OperationCreate,
    user: _schemas.User,
    _db: Session,
):
    operation_db = await _operation_selector(operation_id, user, _db)

    operation_db.operation_name = operation.operation_name
    operation_db.operation_value = operation.operation_value
    operation_db.operation_date = operation.operation_date
    operation_db.subcategory_id = operation.subcategory_id

    _db.commit()
    _db.refresh(operation_db)

    return _schemas.Operation.model_validate(operation_db)


async def get_budget_summary(budget_id: int, _db: Session):
    budget = (
        _db.query(_models.Budget).filter(_models.Budget.budget_id == budget_id).first()
    )
    total = (
        _db.query(func.sum(_models.Operation.operation_value))
        .filter(_models.Operation.budget_id == budget_id)
        .scalar()
    )

    return {"name": budget.budget_name, "budget_sum": total}


async def get_budget_info(budget_id: int, _db: Session):
    budget = (
        _db.query(_models.Budget).filter(_models.Budget.budget_id == budget_id).first()
    )
    budget.budget_encrypted_password = decrypt_password(
        budget.budget_encrypted_password
    )

    return budget


async def get_budget_users(budget_id: int, _db: Session):
    users = _db.query(_models.User).filter(_models.User.budget_id == budget_id)

    return list(map(_schemas.User.model_validate, users))


async def get_categories(_db: Session):
    categories = _db.query(_models.Category)

    return list(map(_schemas.Category.model_validate, categories))


async def get_subcategories(category_id: int, _db: Session):
    if category_id == 0:
        subcategories = _db.query(_models.Subcategory)
    else:
        subcategories = _db.query(_models.Subcategory).filter(
            _models.Subcategory.category_id == category_id
        )

    return list(map(_schemas.Subcategory.model_validate, subcategories))


async def create_subcategory(subcategory: _schemas.SubcategoryCreate, _db: Session):
    new_subcategory = _models.Subcategory(
        subcategory_name=subcategory.subcategory_name,
        subcategory_description=subcategory.subcategory_description,
        category_id=subcategory.category_id,
    )
    _db.add(new_subcategory)
    _db.commit()
    _db.refresh(new_subcategory)

    return new_subcategory

def reminder_model_validate(reminder):
    reminder_dict = reminder.__dict__
    reminder_dict["subcategory_name"] = reminder.subcategory.subcategory_name
    reminder_dict["category_name"] = reminder.subcategory.category.category_name
    reminder_dict["category_color"] = reminder.subcategory.category.category_color
    del reminder_dict["_sa_instance_state"]
    return reminder_dict


async def get_reminders(user: _schemas.User, _db: Session):
    reminders = (
        _db.query(_models.Reminder)
        .options(joinedload(_models.Reminder.subcategory))
        .filter_by(budget_id=user.budget_id)
        .order_by(_models.Reminder.reminder_date)
    )

    return list(map(reminder_model_validate, reminders))

async def _reminder_selector(reminder_id: int, user: _schemas.User, _db: Session):
    reminder = (
        _db.query(_models.Reminder)
        .filter_by(budget_id=user.budget_id)
        .filter(_models.Reminder.reminder_id == reminder_id)
        .first()
    )

    if reminder is None:
        raise _fastapi.HTTPException(status_code=404, detail="Reminder doesn't exist")
    return reminder


async def get_reminder(reminder_id: int, user: _schemas.User, _db: Session):
    reminder = await _reminder_selector(reminder_id=reminder_id, user=user, _db=_db)

    return _schemas.Reminder.model_validate(reminder)

async def create_reminder(
    user: _schemas.User, _db: Session, reminder: _schemas.ReminderCreate
):
    reminder = _models.Reminder(
        **reminder.model_dump(), budget_id=user.budget_id
    )
    _db.add(reminder)
    _db.commit()
    _db.refresh(reminder)

    return _schemas.Reminder.model_validate(reminder)
 
async def delete_reminder(reminder_id: int, user: _schemas.User, _db: Session):
    reminder = await _reminder_selector(reminder_id, user, _db)

    _db.delete(reminder)
    _db.commit()


async def update_reminder(
    reminder_id: int,
    reminder: _schemas.ReminderCreate,
    user: _schemas.User,
    _db: Session,
):
    reminder_db = await _reminder_selector(reminder_id, user, _db)

    reminder_db.reminder_name = reminder.reminder_name
    reminder_db.reminder_description = reminder.reminder_description
    reminder_db.reminder_value = reminder.reminder_value
    reminder_db.reminder_date = reminder.reminder_date
    reminder_db.subcategory_id = reminder.subcategory_id
    reminder_db.reminder_repeat_quantity = reminder.reminder_repeat_quantity
    reminder_db.reminder_repeat_scale = reminder.reminder_repeat_scale

    _db.commit()
    _db.refresh(reminder_db)

    return _schemas.Reminder.model_validate(reminder_db)

async def set_reminder_to_next_cycle(
    reminder_id:int,
    user: _schemas.User,
    _db: Session,
):
    reminder_db = await _reminder_selector(reminder_id, user, _db)
    
    days=0
    months=0
    years=0
    
    if(reminder_db.reminder_repeat_scale=="days"):
        days=reminder_db.reminder_repeat_quantity
    elif (reminder_db.reminder_repeat_scale=="months"):
        months = reminder_db.reminder_repeat_quantity
    elif (reminder_db.reminder_repeat_scale=="years"):
        years = reminder_db.reminder_repeat_quantity
    
    date = reminder_db.reminder_date
    next_date = date + relativedelta(years=years, months=months, days=days)
    
    reminder_db.reminder_date=next_date
    
    _db.commit()
    _db.refresh(reminder_db)
    
    return _schemas.Reminder.model_validate(reminder_db)


async def delete_user(user_id:int, _db:Session):
    user_to_delete = _db.query(_models.User).filter(_models.User.user_id==user_id).first()
    if(user_to_delete.budget_id != 0):
        await change_operations_user(user_to_delete.user_id, user_to_delete.budget_id, _db)
    
    _db.delete(user_to_delete)
    _db.commit()
    
async def detach_user(user_id:int, _db:Session):
    user_to_detach = _db.query(_models.User).filter(_models.User.user_id==user_id).first()
    
    user_to_detach.budget_id = 0
    
    _db.commit()
    _db.refresh(user_to_detach)

async def change_operations_user(old_user_id: int, budget_id: int, _db: Session):
    new_user = _db.query(_models.User).filter(
        _models.User.budget_id == budget_id,
        _models.User.user_id != old_user_id
    ).first()

    if new_user is None:
        raise _fastapi.HTTPException(status_code=404, detail="No other user in this budget")

    operations_to_update = _db.query(_models.Operation).filter(
        _models.Operation.user_id == old_user_id,
        _models.Operation.budget_id == budget_id
    )
    operations_to_update.update({ _models.Operation.user_id: new_user.user_id })
    _db.commit()
    for operation in operations_to_update.all():
        _db.refresh(operation)

async def delete_budget(budget_id:int, _db:Session):
    users_to_update = _db.query(_models.User).filter(_models.User.budget_id == budget_id)

    users_to_update.update({ _models.User.budget_id: 0 })
    _db.commit()

    for user in users_to_update.all():
        _db.refresh(user)
        
    budget_to_delete = _db.query(_models.Budget).filter(_models.Budget.budget_id == budget_id).first()
    
    if not budget_to_delete:
        raise _fastapi.HTTPException(status_code=404, detail="Budget with this ID does not exist")
        
    _db.delete(budget_to_delete)
    _db.commit()
    

async def create_category(category:_schemas.CategoryCreate, _db:Session):
    new_category = _models.Category(
        category_name=category.category_name,
        category_description=category.category_description,
        category_color=category.category_color
    )
    
    _db.add(new_category)
    _db.commit()
    _db.refresh(new_category)

    return new_category

async def get_category(category_name:str, _db:Session):
    category = _db.query(_models.Category).filter(_models.Category.category_name==category_name).first()
    return category

async def delete_category(category_id:int, _db:Session):
    subcategories_to_delete = _db.query(_models.Subcategory).filter(_models.Subcategory.category_id==category_id).all()
    
    for subcategory in subcategories_to_delete:
        await delete_subcategory(subcategory.subcategory_id, _db)
        
    category_to_delete = _db.query(_models.Category).filter(_models.Category.category_id==category_id).first()
    if not category_to_delete:
            raise _fastapi.HTTPException(status_code=404, detail="Category with this ID does not exist")

    _db.delete(category_to_delete)
    _db.commit() 
        
    
async def delete_subcategory(subcategory_id:int, _db:Session):
    operations_to_update = _db.query(_models.Operation).filter(_models.Operation.subcategory_id==subcategory_id)
    
    reminders_to_update = _db.query(_models.Reminder).filter(_models.Reminder.subcategory_id==subcategory_id)
    
    for operation in operations_to_update:
        await uncategorize_operation(operation.operation_id, _db)
        
    for reminder in reminders_to_update:
        await uncategorize_reminder(reminder.reminder_id, _db)
    
    subcategory_to_delete = _db.query(_models.Subcategory).filter(_models.Subcategory.subcategory_id==subcategory_id).first()  
    _db.delete(subcategory_to_delete)
    _db.commit()

async def uncategorize_operation(operation_id:int, _db:Session):
    operation_to_update = _db.query(_models.Operation).filter(_models.Operation.operation_id==operation_id).first()
    
    operation_to_update.subcategory_id=0
    
    _db.commit()
    _db.refresh(operation_to_update)
    
async def uncategorize_reminder(reminder_id:int, _db:Session):
    reminder_to_update = _db.query(_models.Reminder).filter(_models.Reminder.reminder_id==reminder_id).first()
    
    reminder_to_update.subcategory_id=0
    
    _db.commit()
    _db.refresh(reminder_to_update)
