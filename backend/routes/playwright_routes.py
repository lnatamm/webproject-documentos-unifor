from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from models.enrollment_bill_model import EnrollmentBill
from controllers.playwright_controll import PlaywrightController
from datetime import datetime
from io import BytesIO

api_playwright = APIRouter(prefix="/playwright", tags=["Playwright"])

@api_playwright.get("/financeiro/mensalidade", response_model=EnrollmentBill)
def get_monthly_bill(date: str = Query(..., description="Date in YYYY-MM-DD format for the monthly bill", example="2025-07-01")):
    """
    Endpoint to retrieve the monthly enrollment bill.
    This is a placeholder implementation.
    """
    playwright = PlaywrightController(datetime.strptime(date, "%Y-%m-%d"))
    monthly_bill = playwright.get_monthly_bill()
    if monthly_bill['document']:
        pdf_stream = BytesIO(monthly_bill['document'])
        return StreamingResponse(pdf_stream, media_type="application/pdf",
                                 headers={"Content-Disposition": f"attachment; filename={monthly_bill['name']}"})