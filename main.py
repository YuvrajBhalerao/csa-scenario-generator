from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="CSA PDI Scenario Generator")

# We will uncomment this once we build the api/routes.py file
# from api.routes import router as api_router
# app.include_router(api_router, prefix="/api")

# Mount the 'static' folder to serve CSS, JS, and images
# Make sure the 'static' folder exists in your root directory before running
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the main landing page at the root URL ("/")
@app.get("/", tags=["UI"])
async def serve_index():
    # Looks for index.html inside the static folder
    return FileResponse("static/index.html")

# Health check endpoint (Useful for Render to know your app is live)
@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "active", "service": "CSA Scenario Generator"}
