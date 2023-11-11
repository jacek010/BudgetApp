from pydantic import BaseModel

class _BudgetBase(BaseModel):
    budget_name: str
    budget_description:str
        

class BudgetCreate(_BudgetBase):
    budget_password:str

    class Config:
        from_attributes = True
        
class Budget(_BudgetBase):
    budget_id:int
    
    class Config:
        from_attributes = True
        
class ExistingBudget(BaseModel):
    budget_id:int
    budget_password:str
    
    class Config:
        from_attributes = True