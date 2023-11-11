from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel
from typing import Union

class _ReminderBase(BaseModel):
    reminder_name:str
    reminder_description:str
    reminder_date:Union[datetime, date]
    reminder_value:Decimal
    reminder_repeat_quantity:int
    reminder_repeat_scale:str
    subcategory_id:int
    
    
class Reminder(_ReminderBase):
    reminder_id:int
    budget_id:int
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed=True
        

class ReminderCreate(_ReminderBase):
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed=True
        
class ReminderTable(Reminder):
    subcategory_name:str
    category_name:str
    category_color:str
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed=True
    
    