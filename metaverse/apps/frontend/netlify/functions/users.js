// Netlify Function for User Management
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

    // Mock user profile responses
    if (httpMethod === 'GET' && path.includes('/profile')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          user: {
            id: '1',
            username: 'demo_user',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            userType: 'FOUNDER',
            bio: 'Passionate entrepreneur building the next big thing',
            location: 'San Francisco, CA',
            website: 'https://demo-startup.com',
            linkedin: 'https://linkedin.com/in/demo-user',
            twitter: 'https://twitter.com/demo_user',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            createdAt: new Date().toISOString(),
            startup: {
              name: 'Demo Startup',
              description: 'Revolutionary AI-powered platform',
              stage: 'SEED',
              industry: 'Technology',
              founded: '2024',
              employees: '1-10',
              website: 'https://demo-startup.com',
              logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
            }
          }
        })
      };
    }

    if (httpMethod === 'PUT' && path.includes('/profile')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Profile updated successfully',
          user: {
            ...data,
            id: '1',
            updatedAt: new Date().toISOString()
          }
        })
      };
    }

    // Get online users for lobby
    if (httpMethod === 'GET' && path.includes('/online')) {
      const mockUsers = [
        {
          id: '1',
          username: 'sarah_founder',
          firstName: 'Sarah',
          lastName: 'Chen',
          userType: 'FOUNDER',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          x: Math.floor(Math.random() * 800),
          y: Math.floor(Math.random() * 600),
          isOnline: true
        },
        {
          id: '2',
          username: 'mike_investor',
          firstName: 'Mike',
          lastName: 'Johnson',
          userType: 'INVESTOR',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          x: Math.floor(Math.random() * 800),
          y: Math.floor(Math.random() * 600),
          isOnline: true
        },
        {
          id: '3',
          username: 'lisa_mentor',
          firstName: 'Lisa',
          lastName: 'Zhang',
          userType: 'MENTOR',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          x: Math.floor(Math.random() * 800),
          y: Math.floor(Math.random() * 600),
          isOnline: true
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          users: mockUsers
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
