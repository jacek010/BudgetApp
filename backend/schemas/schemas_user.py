from pydantic import BaseModel

class _UserBase(BaseModel):
    user_name: str
    user_surname:str
    user_email:str


class UserCreate(_UserBase):
    user_hashed_password: str
    
    class Config:
        from_attributes = True

class User(_UserBase):
    user_id:int
    budget_id:int

    class Config:
        from_attributes = True