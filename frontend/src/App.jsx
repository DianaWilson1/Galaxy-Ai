import { useState } from 'react';
import { login, sendChatMessage } from './api';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleLogin = async (provider) => {
    try {
      // This would connect to your backend auth in a real app
      const success = await login(provider);
      if (success) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
    }
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
        <LandingPage onStartChat={handleStartChat} onLogin={handleLogin} isLoggedIn={isLoggedIn} />
      ) : (
        <ChatInterface
          chatHistory={chatHistory}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;
