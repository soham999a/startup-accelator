// Vercel API Function for Authentication
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, body } = req;

    // Mock authentication responses
    if (method === 'POST') {
      const data = body || {};

      // Login endpoint
      if (req.url.includes('/login') || data.username) {
        return res.status(200).json({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            username: data.username || 'demo_user',
            email: data.email || 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            userType: 'FOUNDER',
            createdAt: new Date().toISOString()
          }
        });
      }

      // Signup endpoint
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '2',
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          userType: data.userType || 'FOUNDER',
          createdAt: new Date().toISOString()
        }
      });
    }

    // Default response
    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
