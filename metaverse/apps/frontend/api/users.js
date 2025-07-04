// Vercel API Function for User Management
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

    // Get user profile
    if (method === 'GET' && req.url.includes('/profile')) {
      return res.status(200).json({
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
      });
    }

    // Update user profile
    if (method === 'PUT' && req.url.includes('/profile')) {
      const data = body || {};
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          ...data,
          id: '1',
          updatedAt: new Date().toISOString()
        }
      });
    }

    // Get online users for lobby
    if (method === 'GET' && req.url.includes('/online')) {
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

      return res.status(200).json({
        success: true,
        users: mockUsers
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
