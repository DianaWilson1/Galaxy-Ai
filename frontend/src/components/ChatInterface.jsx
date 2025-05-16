import {
  ArrowRight,
  ChevronDown,
  MessageSquare,
  MoreVertical,
  Search,
  Star,
  User
} from 'lucide-react';
import { useState } from 'react';
import StarLogo from './StarLogo';
import UserProfile from './UserProfile';

const ChatInterface = ({
  chatHistory,
  inputValue,
  setInputValue,
  handleSendMessage,
  isLoggedIn,
  user,
  onLogout
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Template chat options
  const chatOptions = [
    { id: 1, title: "Speak Any Language: Translate phrases instantly", icon: MessageSquare },
    { id: 2, title: "Explore Philosophy: Discuss profound questions", icon: MessageSquare },
    { id: 3, title: "Code Problem Solver: Debug coding issues with ease", icon: MessageSquare },
    { id: 4, title: "Imagination Unleashed: Create a unique story from any idea", icon: MessageSquare },
    { id: 5, title: "Learn Something New: Explain complex topics in simple terms", icon: MessageSquare },
    { id: 6, title: "Cooking Made Easy: Get custom recipes from your ingredients", icon: MessageSquare },
    { id: 7, title: "Virtual Travel Buddy: Tour the world virtually", icon: MessageSquare },
    { id: 8, title: "Healthy Living Tips: Receive fitness and wellness advice", icon: MessageSquare },
    { id: 9, title: "Art & Music Picks: Discover art and music recommendations", icon: MessageSquare },
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0'}`}>
        {sidebarOpen && (
          <>
            {/* Sidebar header */}
            <div className="p-3 border-b border-gray-800 flex items-center">
              <div className="w-8 h-8 mr-2">
                <StarLogo />
              </div>
              <div className="flex-1">
                <div className="flex items-center bg-gray-800 rounded-md px-2 py-1">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Contents..."
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Recents section */}
            <div className="py-2">
              <div className="flex items-center px-3 py-1">
                <ChevronDown size={16} className="text-gray-400 mr-1" />
                <span className="text-gray-300 font-medium">Recents</span>
                <div className="flex-grow" />
                <button className="text-gray-500 text-xs flex items-center">
                  View all
                  <ArrowRight size={12} className="ml-1" />
                </button>
              </div>

              <div className="mt-1 space-y-1 px-2">
                {chatOptions.slice(0, 9).map((option) => (
                  <div key={option.id} className="flex items-center px-2 py-2 rounded-md hover:bg-gray-800 cursor-pointer">
                    <option.icon size={18} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-300 truncate">{option.title}</span>
                    <div className="flex-grow" />
                    <button className="text-gray-500 hover:text-gray-300">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade plan */}
            <div className="mt-auto p-3 border-t border-gray-800">
              <div className="flex items-center px-2 py-2 rounded-md hover:bg-gray-800 cursor-pointer">
                <User size={18} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Upgrade plan for more access</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-gray-800 flex items-center">
          <div className="flex-1 flex items-center">
            <div className="relative">
              <button className="flex items-center bg-gray-800 rounded-md px-3 py-1.5 text-sm text-gray-300">
                <span>Assistant.01</span>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>
            </div>
          </div>

          {isLoggedIn && user ? (
            <div className="ml-2">
              <UserProfile user={user} onLogout={onLogout} />
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-md ml-2"
            >
              Login
            </button>
          )}
        </div>

        {/* Content area */}
        {chatHistory.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-10 text-white">Galaxy AI</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full mx-auto">
              {/* Recents column */}
              <div>
                <h3 className="flex items-center justify-center text-lg font-medium mb-4 text-gray-300">
                  <div className="w-5 h-5 mr-2 text-blue-400">
                    <Star className="w-full h-full" />
                  </div>
                  Recents
                </h3>

                <div className="space-y-3">
                  {chatOptions.slice(0, 3).map((option, index) => (
                    <div key={index} className="bg-gray-800 hover:bg-gray-750 p-4 rounded-md cursor-pointer">
                      <p className="text-gray-300 text-sm">{option.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequent column */}
              <div>
                <h3 className="flex items-center justify-center text-lg font-medium mb-4 text-gray-300">
                  <div className="w-5 h-5 mr-2 text-blue-400">
                    <MessageSquare className="w-full h-full" />
                  </div>
                  Frequent
                </h3>

                <div className="space-y-3">
                  {chatOptions.slice(3, 6).map((option, index) => (
                    <div key={index} className="bg-gray-800 hover:bg-gray-750 p-4 rounded-md cursor-pointer">
                      <p className="text-gray-300 text-sm">{option.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended column */}
              <div>
                <h3 className="flex items-center justify-center text-lg font-medium mb-4 text-gray-300">
                  <div className="w-5 h-5 mr-2 text-blue-400">
                    <Star className="w-full h-full" />
                  </div>
                  Recommended
                </h3>

                <div className="space-y-3">
                  {chatOptions.slice(6, 9).map((option, index) => (
                    <div key={index} className="bg-gray-800 hover:bg-gray-750 p-4 rounded-md cursor-pointer">
                      <p className="text-gray-300 text-sm">{option.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg px-4 py-2 ${message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                    } ${message.isTyping ? 'animate-pulse' : ''}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How can I help you?"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-12 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              disabled={!inputValue.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
