// server.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoint for travel recommendations
app.post('/api/recommendations', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Spawn a Python process to run your script
    const pythonProcess = spawn('python', ['chat.py', query]);
    
    let output = '';
    let errorOutput = '';
    
    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    // Collect any error output
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error output: ${errorOutput}`);
        return res.status(500).json({ 
          error: 'Error running Python script', 
          details: errorOutput 
        });
      }
      
      // Return the Python script output
      res.json({ recommendations: output });
    });
    
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Error processing your query' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});