#!/bin/bash
# install-ubuntu.sh
# Bash script to setup Smart Waste Detection on Ubuntu/Linux


echo "🚀 Setting up Smart Waste Detection on Ubuntu/Linux..."

# 1. Check Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js (v18+) first."
    exit
else
    echo "✅ Node.js detected: $(node -v)"
fi

# 2. Install dependencies
echo "Installing npm packages..."
npm install

echo "✅ Dependencies installed."

echo "You can now run the project with:"
echo "npm run dev"
echo "Then open http://localhost:3000 in your browser."
