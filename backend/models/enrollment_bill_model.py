from pydantic import BaseModel

class EnrollmentBill(BaseModel):
    name: str
    document: bytes