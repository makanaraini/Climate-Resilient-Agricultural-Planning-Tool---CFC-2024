from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Crop(Base):
    __tablename__ = 'crops'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    variety = Column(String)
    planting_date = Column(String)  # Consider using Date type if needed
    expected_harvest_date = Column(String)  # Consider using Date type if needed
    field_size = Column(Float)  # in hectares or acres
    expected_yield = Column(Float)
    
    farmer_id = Column(Integer, ForeignKey('farmers.id'))
    farmer = relationship("Farmer", back_populates="crops")

    def __repr__(self):
        return f"<Crop(name='{self.name}', variety='{self.variety}', planting_date='{self.planting_date}')>"
