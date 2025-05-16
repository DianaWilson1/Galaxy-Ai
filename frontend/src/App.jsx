import { useEffect, useState } from 'react';
import { getUserProfile, sendChatMessage } from './api';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Clear invalid token
      localStorage.removeItem('token');
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setChatHistory([]);
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const newMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setChatHistory([...chatHistory, newMessage]);

    const userMessage = inputValue;
    setInputValue('');

    try {
      // Send message to backend and get AI response
      const response = await sendChatMessage(userMessage, isLoggedIn);

      const aiResponse = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'ai'
      };

      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Fallback error message
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'ai'
      };

      setChatHistory(prev => [...prev, errorResponse]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
      {!showChat ? (
        <LandingPage
          onStartChat={handleStartChat}
          onLoginSuccess={handleLoginSuccess}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      ) : (
        <ChatInterface
          chatHistory={chatHistory}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
