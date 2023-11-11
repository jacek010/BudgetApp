from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Budget(Base):
    __tablename__ = 'budgets'

    budget_id = Column(Integer, primary_key=True, index=True)
    budget_name=Column(String(30), nullable=False)
    budget_description=Column(String(255))
    budget_encrypted_password=Column(String, nullable=False)

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    user_name = Column(String(20), index=True, nullable=False)
    user_surname = Column(String(30), index=True, nullable=False)
    user_email = Column(String(40), index=True, nullable=False)
    user_hashed_password = Column(String(255), index=True, nullable=False)
    budget_id = Column(Integer, ForeignKey('budgets.budget_id'), nullable=False, default=0)

class Category(Base):
    __tablename__ = 'categories'
    
    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(30), index=True, nullable=False)
    category_description = Column(String(255))
    category_color = Column(String(6), index=True, nullable=False, default="ffffff")
    
class Subcategory(Base):
    __tablename__ = 'subcategories'
    
    subcategory_id = Column(Integer, primary_key=True)
    subcategory_name = Column(String(30), index = True, nullable=False)
    subcategory_description = Column(String(255))
    category_id = Column(Integer, ForeignKey('categories.category_id'), nullable=False)
    category = relationship("Category")
    
class Operation(Base):
    __tablename__ = 'operations'
    
    operation_id = Column(Integer, primary_key=True)
    operation_name = Column(String(30), index=True, nullable=False)
    budget_id = Column(Integer, ForeignKey('budgets.budget_id'), nullable=False)
    budget = relationship("Budget")
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    user = relationship("User")
    subcategory_id = Column(Integer, ForeignKey('subcategories.subcategory_id'), nullable=False)
    subcategory = relationship("Subcategory")
    operation_value = Column(DECIMAL(2), nullable=False)
    operation_date = Column(DateTime, nullable=False)
    

class Reminder(Base):
    __tablename__='reminders'
    
    
    reminder_id = Column(Integer, primary_key=True)
    reminder_name = Column(String(50), index=True, nullable=False)
    reminder_description = Column(String(255))
    reminder_date = Column(DateTime, nullable=False)
    budget_id = Column(Integer, ForeignKey('budgets.budget_id'), nullable=False)
    budget = relationship("Budget")
    reminder_value = Column(DECIMAL(2), nullable=False)
    reminder_repeat_quantity = Column(Integer, nullable=False)
    reminder_repeat_scale = Column(String(10), nullable=False)
    subcategory_id = Column(Integer, ForeignKey('subcategories.subcategory_id'), nullable=False)
    subcategory = relationship("Subcategory")
    
    