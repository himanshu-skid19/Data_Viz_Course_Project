export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { query } = req.body;
        
        // Option 1: Forward to your existing backend
        try {
          const response = await fetch('http://localhost:5000/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });
          
          const data = await response.json();
          return res.status(200).json(data);
        } catch (error) {
          // Fallback to mock response if backend is not available
          console.error('Backend connection error:', error);
          return res.status(200).json({ 
            recommendations: `Here are some recommendations related to: ${query}` 
          });
        }
        
      } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
          recommendations: 'Sorry, I couldn\'t process your request at the moment.' 
        });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }