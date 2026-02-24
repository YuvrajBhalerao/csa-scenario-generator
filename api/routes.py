from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.gemini_client import get_scenario_from_gemini, CSA_MODULES

# Initialize the router
router = APIRouter()

# Define the expected data payload from the frontend
class ScenarioRequest(BaseModel):
    module: str

@router.post("/generate-scenario")
async def generate_scenario(request: ScenarioRequest):
    """Endpoint to receive module selection and return AI scenario."""
    
    # Security/Validation: Ensure the requested module actually exists in our list
    if request.module != "random" and request.module not in CSA_MODULES:
        raise HTTPException(status_code=400, detail="Invalid module selected.")
        
    # Call the AI client
    scenario_data = get_scenario_from_gemini(request.module)
    
    # Handle potential AI or parsing errors
    if "error" in scenario_data:
         raise HTTPException(status_code=500, detail=scenario_data["error"])
         
    return scenario_data
