# AI Shopping Assistant

An intelligent shopping assistant that provides personalized product recommendations and conversational shopping experiences.

## Features

- Personalized product recommendations using LangGraph
- Conversational AI interface powered by GPT-4
- Sentiment analysis for user feedback
- Visual search capability
- Cross-platform support
- Integration with existing e-commerce systems

## Tech Stack

- **Frontend**: React, TypeScript, Redux Toolkit
- **Backend**: Python (FastAPI)
- **AI/ML**: LangGraph, GPT-4, TensorFlow/PyTorch
- **Database**: MongoDB (for user data), Elasticsearch (for search)
- **Cloud**: AWS (EC2, S3, Lambda)
- **DevOps**: Docker, GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (3.9+)
- Docker
- AWS Account (for deployment)

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

### Running Locally

1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
ai-shopping-assistant/
├── backend/                 # FastAPI backend
│   ├── app/                 
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configurations
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React frontend
│   ├── public/             
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── features/       # Feature-based modules
│       ├── services/       # API services
│       └── store/          # State management
│
└── docker/                 # Docker configurations
    ├── backend.dockerfile
    └── frontend.dockerfile
```

## License

MIT
