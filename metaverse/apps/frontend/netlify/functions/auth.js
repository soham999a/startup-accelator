// Netlify Function for Authentication
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { path, httpMethod, body } = event;
    const data = body ? JSON.parse(body) : {};

    // Mock authentication responses
    if (httpMethod === 'POST' && path.includes('/login')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
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
        })
      };
    }

    if (httpMethod === 'POST' && path.includes('/signup')) {
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
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
        })
      };
    }

    // Default response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
