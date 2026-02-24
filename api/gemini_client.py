import os
import random
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load variables from .env if running locally (Render injects them automatically)
load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

CSA_MODULES = [
    "ServiceNow Overview",
    "User Interface & Navigation",
    "Lists, Filters & Forms",
    "Data Schema & Tables",
    "Self-Service, Knowledge-Catalog & Workflows",
    "Reporting & Dashboards, Platform Analytics",
    "ServiceNow Utilities",
    "Security in ServiceNow Platform"
]

def get_scenario_from_gemini(module: str) -> dict:
    """Generates a ServiceNow PDI scenario using Gemini."""
    
    # Handle the "Generate from any module" logic
    target_module = random.choice(CSA_MODULES) if module.lower() == "random" else module
    
    prompt = f"""
    Act as an expert ServiceNow Certified System Administrator (CSA) instructor.
    Create a practical, real-world Personal Developer Instance (PDI) scenario for the module: '{target_module}'.
    
    The output MUST be strictly valid JSON. Do not include markdown formatting blocks (like ```json).
    Use exactly this structure:
    {{
        "module_name": "{target_module}",
        "problem_statement": "Describe a realistic business problem that needs solving in ServiceNow.",
        "guided_steps": ["Step 1...", "Step 2..."],
        "hints": ["Hint 1...", "Hint 2..."],
        "pro_tips": "One or two advanced tips related to best practices.",
        "theoretical_references": ["Topic 1 to study", "Topic 2 to study"]
    }}
    """
    
    try:
        # Using a fast model optimized for quick web responses
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )
        
        response = model.generate_content(prompt)
        
        # Parse the JSON string into a Python dictionary
        return json.loads(response.text)
        
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response into JSON."}
    except Exception as e:
        return {"error": f"API Error: {str(e)}"}
