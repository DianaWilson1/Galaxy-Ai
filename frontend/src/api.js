// api.js - Updated for Google Generative AI (Gemini) API

// API key (for development only, move to environment variables in production)
const GOOGLE_API_KEY = "AIzaSyCwg0_YjW1prl3KGMM4qVmmImCZL5yC3gU";

// Send message to Google Generative AI
export const sendChatMessage = async (message, isLoggedIn) => {
  try {
    console.log("Connecting to Google Generative AI API");

    // Make request to Google Generative AI API with correct format
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "You are Galaxy AI, a helpful, friendly, and concise assistant. Always provide useful responses. Now respond to this question: " + message
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.95
        }
      })
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorMessage = `API Error (${response.status})`;

      try {
        const errorData = await response.json();
        console.error("API Error Details:", errorData);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        const textError = await response.text();
        console.error("API Error Text:", textError);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Extract the response text
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated");
    }

    const aiResponse = data.candidates[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("Could not extract response text");
    }

    return { message: aiResponse };
  } catch (error) {
    console.error('API Error:', error);

    return {
      message: `Sorry, I encountered an error while trying to process your request. Error: ${error.message}. Please try again.`
    };
  }
};

// Keep your existing authentication functions
export const login = async (provider) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const userData = {
    id: 1,
    username: `${provider}_user`,
    email: `${provider}@example.com`,
    first_name: provider.charAt(0).toUpperCase() + provider.slice(1),
    last_name: 'User',
    profile: { avatar: null }
  };

  localStorage.setItem('token', `mock-${provider}-token`);
  return userData;
};

export const logout = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem('token');
  return true;
};

export const getUserProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  if (token.includes('google')) {
    return {
      id: 1,
      username: 'google_user',
      email: 'google@example.com',
      first_name: 'Google',
      last_name: 'User',
      profile: { avatar: null }
    };
  } else {
    return {
      id: 2,
      username: 'facebook_user',
      email: 'facebook@example.com',
      first_name: 'Facebook',
      last_name: 'User',
      profile: { avatar: null }
    };
  }
};
