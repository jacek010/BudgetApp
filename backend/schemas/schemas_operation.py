from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel
from typing import Union


class _OperationBase(BaseModel):
    operation_name: str
    subcategory_id: int
    operation_value: Decimal
    operation_date: Union[datetime, date]


class Operation(_OperationBase):
    operation_id: int
    user_id: int
    budget_id: int


    class Config:
        from_attributes = True
        arbitrary_types_allowed=True


class OperationCreate(_OperationBase):
    class Config:
        from_attributes = True
        arbitrary_types_allowed=True
        
class OperationTable(Operation):
    user_name:str
    user_surname:str
    subcategory_name:str
    category_name:str
    category_color:str
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed=True
