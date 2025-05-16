import { useEffect, useState } from 'react';
import { getUserProfile, sendChatMessage } from './api';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Track current conversation and all conversations
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Current chat history derived from conversations
  const chatHistory = currentConversationId
    ? conversations.find(conv => conv.id === currentConversationId)?.messages || []
    : [];

  // Load conversations from localStorage on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
      loadConversations();
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isLoggedIn && conversations.length > 0) {
      localStorage.setItem('userConversations', JSON.stringify(conversations));
    }
  }, [conversations, isLoggedIn]);

  const loadConversations = () => {
    try {
      const savedConversations = localStorage.getItem('userConversations');
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    loadConversations();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setConversations([]);
    setCurrentConversationId(null);
    setShowChat(false);
  };

  const handleStartChat = () => {
    setShowChat(true);
    // Start with a new conversation
    if (!currentConversationId) {
      startNewConversation();
    }
  };

  const startNewConversation = () => {
    const newConversationId = Date.now();
    setCurrentConversationId(newConversationId);
    setConversations(prev => [...prev, {
      id: newConversationId,
      title: '', // Will be set to the first message
      createdAt: new Date().toISOString(),
      messages: []
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create a new conversation if none exists
    if (!currentConversationId) {
      startNewConversation();
    }

    // Add user message to current conversation
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };

    // Update conversations with the new message
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        if (conv.id === currentConversationId) {
          // If this is the first message, set it as the conversation title
          const isFirstMessage = conv.messages.length === 0;
          const updatedConv = {
            ...conv,
            messages: [...conv.messages, userMessage],
            // Set the title to the first user message
            title: isFirstMessage ? inputValue : conv.title
          };
          return updatedConv;
        }
        return conv;
      });
      return updatedConversations;
    });

    const userMessageText = inputValue;
    setInputValue('');

    // Show typing indicator
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, {
              id: Date.now() + 0.5,
              text: "Typing...",
              sender: 'ai',
              isTyping: true
            }]
          };
        }
        return conv;
      });
    });

    try {
      // Send message to AI and get response
      const response = await sendChatMessage(userMessageText, isLoggedIn);

      // Remove typing indicator and add AI response
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: conv.messages
                .filter(msg => !msg.isTyping)
                .concat({
                  id: Date.now() + 1,
                  text: response.message,
                  sender: 'ai'
                })
            };
          }
          return conv;
        });
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Remove typing indicator and add error message
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: conv.messages
                .filter(msg => !msg.isTyping)
                .concat({
                  id: Date.now() + 1,
                  text: "I'm having trouble connecting. Please check your connection or try again later.",
                  sender: 'ai'
                })
            };
          }
          return conv;
        });
      });
    }
  };

  const handleConversationSelect = (conversationId) => {
    setCurrentConversationId(conversationId);
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
          conversations={conversations}
          currentConversationId={currentConversationId}
          chatHistory={chatHistory}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleConversationSelect={handleConversationSelect}
          startNewConversation={startNewConversation}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
