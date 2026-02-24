import os
import random
import google.generativeai as genai
from dotenv import load_dotenv

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
    try:
        target_module = random.choice(CSA_MODULES) if module.lower() == "random" else module
        
        # Absolute simplest call. No JSON rules, no config. Just testing the connection.
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(f"Write a 1 sentence ServiceNow scenario for {target_module}.")
        
        # Hardcoding the JSON response to bypass any parsing errors
        return {
            "module_name": target_module,
            "problem_statement": response.text.strip(),
            "guided_steps": ["Step 1: Test connection"],
            "hints": ["Tracer bullet successful"],
            "pro_tips": "We bypassed the JSON parser.",
            "theoretical_references": ["Debugging 101"]
        }
    except Exception as e:
        # If it crashes, this custom string tells us our code actually deployed
        return {"error": f"TRACER_BULLET_ERROR: {str(e)}"}
