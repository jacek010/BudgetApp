from pydantic import BaseModel


class _SubcategoryBase(BaseModel):
    subcategory_name: str
    subcategory_description: str
    category_id: int


class Subcategory(_SubcategoryBase):
    subcategory_id: int

    class Config:
        from_attributes = True


class SubcategoryCreate(_SubcategoryBase):
    class Config:
        from_attributes = True
