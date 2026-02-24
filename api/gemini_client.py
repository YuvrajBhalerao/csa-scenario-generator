import os
import random
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

CSA_MODULES = [
    "ServiceNow Overview", "User Interface & Navigation", "Lists, Filters & Forms",
    "Data Schema & Tables", "Self-Service, Knowledge-Catalog & Workflows",
    "Reporting & Dashboards, Platform Analytics", "ServiceNow Utilities", "Security in ServiceNow Platform"
]

def get_scenario_from_gemini(module: str) -> dict:
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
        # Using the updated model name
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        # Defensive Programming: Clean the text before parsing
        raw_text = response.text.strip()
        
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
            
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        # Parse the cleaned string into a proper Python dictionary
        return json.loads(raw_text.strip())
        
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response. The model didn't return valid JSON."}
    except Exception as e:
        return {"error": f"API Error: {str(e)}"}
