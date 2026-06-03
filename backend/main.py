from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Optional

# AVA Career Oracle API - "Built with rigor"
app = FastAPI(
    title="AVA Career Oracle API",
    description="Bridge between Voice Agent (ElevenLabs) and Backend Data (CRM Simulator).",
    version="1.1.0"
)

# In-memory mock database
INTERNSHIPS = [
    {"id": 1, "company": "AVA AI", "role": "Junior Voice AI Dev", "location": "Hybrid/Paris", "status": "Open"},
    {"id": 2, "company": "The Forge", "role": "AI Automation Engineer", "location": "Remote", "status": "Open"},
    {"id": 3, "company": "EcoTech", "role": "Fullstack Intern", "location": "Luanda", "status": "Closed"},
]

@app.get("/")
async def health():
    """Health check endpoint to ensure API is reachable."""
    return {"status": "alive", "engine": "FastAPI 0.110+", "mode": "async"}

@app.get("/check-slots")
async def check_slots(role_query: Optional[str] = Query(None)):
    """Search for open internship slots based on role keyword."""
    if role_query:
        results = [i for i in INTERNSHIPS if role_query.lower() in i["role"].lower() and i["status"] == "Open"]
        return {"count": len(results), "jobs": results}
    
    open_jobs = [i for i in INTERNSHIPS if i["status"] == "Open"]
    return {"count": len(open_jobs), "jobs": open_jobs}

class StudentLead(BaseModel):
    name: str        
    phone: str       
    interest: str    

@app.post("/capture-lead")
async def capture_lead(lead: StudentLead):
    """Register a potential candidate/lead into the CRM and local database."""
    from datetime import datetime
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] Name: {lead.name} | Phone: {lead.phone} | Interest: {lead.interest}\n"
    
    # Save to local file
    try:
        with open("leads.txt", "a") as f:
            f.write(entry)
        print(f"PIPELINE: Lead {lead.name} saved to leads.txt and CRM.")
    except Exception as e:
        print(f"ERROR: Failed to save lead: {e}")

    return {
        "status": "success", 
        "confirmation": f"Agendado com sucesso para {lead.name}. Contactaremos em {lead.phone}."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
