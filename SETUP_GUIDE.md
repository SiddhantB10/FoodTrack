# FoodTrack - Quick Start Guide

## 🚀 Installation & Setup

### Step 1: Install Frontend Dependencies

Open a terminal in the FoodTrack directory and run:

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Three.js, and Recharts.

### Step 2: Start the Frontend Development Server

```bash
npm run dev
```

The website will be available at: **http://localhost:3000**

### Step 3: Set Up the Backend API (Optional)

The frontend works with simulated data, but for real API integration:

1. Open a **new terminal** window
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`

5. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Start the FastAPI server:
   ```bash
   python main.py
   ```

The API will be available at: **http://localhost:8000**

## 📱 Using the Website

### Home Page
- View the hero section with 3D animations
- Scroll to see features and benefits
- Click "Predict Delivery Time" to try the predictor

### Predict ETA Page
1. Enter delivery distance (e.g., 5.2 km)
2. Select traffic level
3. Choose weather condition
4. Input restaurant preparation time
5. Select order size
6. Click "Predict ETA" button
7. View results with confidence score

### Dashboard
- View real-time analytics
- See prediction accuracy trends
- Analyze traffic and weather impact
- Monitor model performance

### How It Works
- Understand the ML pipeline
- See the 4-step process
- Learn about data flow

### About
- Read about the ML model
- View technical specifications
- Understand model performance metrics

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { /* your colors */ },
  accent: { /* your colors */ },
}
```

### Modify Content
- Text content: Edit files in `src/app/` and `src/components/`
- Stats and data: Update data arrays in component files
- Model info: Edit `backend/main.py`

## 🏗️ Building for Production

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

## 📊 Features Included

✅ Responsive design (mobile, tablet, desktop)
✅ 3D animations with Three.js
✅ Smooth page transitions
✅ Interactive charts and graphs
✅ ML prediction form
✅ Real-time validation
✅ Professional UI/UX
✅ Clean, maintainable code
✅ Full TypeScript support
✅ FastAPI backend with docs
✅ Comprehensive README

## 🎯 Perfect For

- College mini-projects
- ML/AI course demonstrations
- Full-stack portfolio projects
- Viva presentations
- Resume showcase
- Learning modern web development

## 💡 Tips

1. **Demo Preparation**: 
   - Keep both frontend and backend running
   - Open http://localhost:3000 in your browser
   - Test the prediction form before presenting

2. **Code Review**:
   - All code is clean and well-commented
   - Easy to explain during viva
   - Follows best practices

3. **Customization**:
   - Change project name in package.json
   - Update API endpoints if deploying
   - Modify color schemes to match preferences

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Frontend (change port in package.json or):
npm run dev -- -p 3001

# Backend:
uvicorn main:app --port 8001
```

**Dependencies issues:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Python issues:**
```bash
# Ensure Python 3.9+ is installed
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## 📞 Need Help?

1. Check the main README.md
2. Review backend/README.md for API details
3. Check API docs at http://localhost:8000/docs
4. Review code comments for explanations

---

**Happy Coding! 🚀**
