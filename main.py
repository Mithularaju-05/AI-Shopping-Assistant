from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
    app.database = app.mongodb_client[os.getenv("MONGODB_DB")]
    
    yield
    
    # Shutdown
    app.mongodb_client.close()

# Create FastAPI app
app = FastAPI(lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int

class UserPreference(BaseModel):
    user_id: str
    preferred_categories: List[str] = []
    price_range: Optional[tuple[float, float]] = None
    brand_preferences: List[str] = []

# API Routes
@app.get("/")
async def root():
    return {"message": "AI Shopping Assistant API"}

@app.get("/api/products")
async def get_products(category: Optional[str] = None, limit: int = 10, skip: int = 0):
    query = {}
    if category:
        query["category"] = category
    
    products = []
    cursor = app.database.products.find(query).skip(skip).limit(limit)
    async for document in cursor:
        products.append(Product(**document))
    
    return products

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = await app.database.products.find_one({"id": product_id})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: str, limit: int = 5):
    # TODO: Implement recommendation logic using LangGraph
    # For now, return random products
    pipeline = [{"$sample": {"size": limit}}]
    recommended_products = []
    cursor = app.database.products.aggregate(pipeline)
    async for doc in cursor:
        recommended_products.append(Product(**doc))
    
    return recommended_products

# AI Services
class AIService:
    def __init__(self):
        self.model = None  # Will be initialized with LangGraph model
        
    async def get_personalized_recommendations(self, user_id: str, context: dict = None):
        # TODO: Implement LangGraph-based recommendations
        pass
    
    async def process_chat_message(self, user_id: str, message: str):
        # TODO: Implement GPT-4 chat processing
        return {"response": f"I'm your shopping assistant. You said: {message}"}
    
    async def analyze_sentiment(self, text: str):
        # TODO: Implement sentiment analysis
        return {"sentiment": "positive", "confidence": 0.9}
    
    async def find_similar_products(self, image_url: str):
        # TODO: Implement visual search
        return []

# Initialize AI Service
ai_service = AIService()

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)