from pydantic import BaseModel

class _CategoryBase(BaseModel):
    category_name:str
    category_description:str
    category_color:str
    
class Category(_CategoryBase):
    category_id:int
    
    class Config:
        from_attributes = True
        
class CategoryCreate(_CategoryBase):
    
    class Config:
        from_attributes = True