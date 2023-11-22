from sqlalchemy import create_engine
from sqlalchemy.orm import Session
   
engine = create_engine('mysql+pymysql://root:root_password@db:3306/budget_db')
session = Session(engine)

def get_db():
    try:
        yield session
    finally:
        session.close()