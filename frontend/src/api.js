// API functions to communicate with the Django backend

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Authentication
export const login = async (provider) => {
  try {
    const response = await fetch(`${API_URL}/auth/login/${provider}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // To handle cookies for session auth
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }

    localStorage.removeItem('token');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// Chat
export const sendChatMessage = async (message, isLoggedIn) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add auth token if user is logged in
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
    }

    const response = await fetch(`${API_URL}/chat/message/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Get chat history for logged in user
export const getChatHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/chat/history/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get chat history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat history error:', error);
    throw error;
  }
};
// Authentication with social providers
// Add this to your src/api.js file

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/login/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Google login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);

    // For testing when backend isn't ready
    if (!data.user) {
      return {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        profile: {
          avatar: null
        }
      };
    }

    return data.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export const loginWithFacebook = async (accessToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/login/facebook/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Facebook login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (error) {
    console.error('Facebook login error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/auth/users/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};
