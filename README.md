# Wine Quality Prediction 🍷

**Project Repository:** ict-gnu-final-sem-project-2015-ibm-g09_wine_quality_prediction  
**Institution:** Ganpat University (GUNI)  
**Semester:** Final Semester Project (8th Sem)

## Overview
This project is a full-stack web application designed to predict the quality of wine based on its physicochemical properties. It utilizes a trained machine learning model served via a FastAPI backend alongside a modern, interactive React frontend to provide insights, predictions, and historical tracking of wine data.

## Features
- **Real-time Prediction:** Input wine attributes (acidity, pH, alcohol, etc.) and instantly receive a quality prediction.
- **Bulk CSV Upload:** Upload datasets to process multiple wine samples and visualize the results on a dashboard.
- **Interactive Discover Page:** Explore random wine entries and view engaging 3D assets and animations.
- **User Authentication:** Secure login system using Firebase.
- **History Tracking:** Save your past predictions to a MongoDB database to review them later.

## Technology Stack

### Frontend (`/frontend`)
- **Framework:** React 19 built with Vite
- **Styling:** Tailwind CSS & Custom CSS
- **Animations & 3D:** Framer Motion, Three.js (@react-three/fiber, @react-three/drei)
- **Data Visualization:** Recharts
- **Authentication:** Firebase

### Backend (`/Backend`)
- **Framework:** FastAPI
- **Machine Learning:** Scikit-learn (Pickle Models)
- **Database:** MongoDB (via PyMongo)
- **Server:** Uvicorn

## Installation & Setup

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ (for backend)
- MongoDB Database URI
- Firebase Configuration

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   Create a `.env` file in the `Backend` directory and add your `MONGODB_URI` and `DB_NAME`.
4. Run the FastAPI server:
   ```bash
   python -m uvicorn app:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file based on `.env.example` with your Firebase configuration.
4. Run the development server:
   ```bash
   npm run start
   ```

## Acknowledgements
This is an academic project developed as part of the final semester curriculum.
