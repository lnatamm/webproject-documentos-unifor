from pydantic import BaseModel

class EnrollmentBill(BaseModel):
    document: bytes