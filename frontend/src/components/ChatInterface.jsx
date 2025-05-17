import {
  Check,
  ChevronDown,
  Edit,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Star,
  Trash,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import StarLogo from './StarLogo';
import UserProfile from './UserProfile';

const ChatInterface = ({
  conversations,
  currentConversationId,
  chatHistory,
  inputValue,
  setInputValue,
  handleSendMessage,
  handleConversationSelect,
  startNewConversation,
  isLoggedIn,
  user,
  onLogout,
  // Add new required props for conversation management
  updateConversationTitle,
  deleteConversation
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('recents'); // 'recents' or 'templates'
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search functionality
  const [selectedAssistant, setSelectedAssistant] = useState('Assistant 1.0'); // New state for assistant selection
  const [assistantDropdownOpen, setAssistantDropdownOpen] = useState(false); // State to control dropdown visibility

  // Add state for editing conversation titles
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Check if functions are properly defined
  const [functionsReady, setFunctionsReady] = useState(false);

  // Check if the required functions are available
  useEffect(() => {
    const hasUpdateFunction = typeof updateConversationTitle === 'function';
    const hasDeleteFunction = typeof deleteConversation === 'function';

    console.log("ChatInterface props check:", {
      hasUpdateFunction,
      hasDeleteFunction
    });

    setFunctionsReady(hasUpdateFunction && hasDeleteFunction);
  }, [updateConversationTitle, deleteConversation]);

  // Available assistants
  const assistantOptions = [
    "Assistant 2.0",
    "Assistant 3.0"
  ];

  // Template chat options
  const chatOptions = [
    { id: 1, title: "Speak Any Language: Translate phrases instantly", icon: MessageSquare, category: "recents" },
    { id: 2, title: "Explore Philosophy: Discuss profound questions", icon: MessageSquare, category: "recents" },
    { id: 3, title: "Code Problem Solver: Debug coding issues with ease", icon: MessageSquare, category: "recents" },
    { id: 4, title: "Imagination Unleashed: Create a unique story from any idea", icon: MessageSquare, category: "frequent" },
    { id: 5, title: "Learn Something New: Explain complex topics in simple terms", icon: MessageSquare, category: "frequent" },
    { id: 6, title: "Cooking Made Easy: Get custom recipes from your ingredients", icon: MessageSquare, category: "frequent" },
    { id: 7, title: "Virtual Travel Buddy: Tour the world virtually", icon: MessageSquare, category: "recommended" },
    { id: 8, title: "Healthy Living Tips: Receive fitness and wellness advice", icon: MessageSquare, category: "recommended" },
    { id: 9, title: "Art & Music Picks: Discover art and music recommendations", icon: MessageSquare, category: "recommended" },
  ];

  // Sort conversations by most recent first
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Filter conversations based on search term
  const filteredConversations = sortedConversations.filter(conversation => {
    return (conversation.title || "New Conversation").toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handler for clicking the logo/star to start a new conversation
  const handleLogoClick = () => {
    startNewConversation();
  };

  // Start a new conversation with a template prompt
  const handleTemplateClick = (templateTitle) => {
    startNewConversation();
    // Set a timeout to ensure the new conversation is created before setting the input
    setTimeout(() => {
      setInputValue(templateTitle.split(":")[0]);
    }, 100);
  };

  // Handler for selecting an assistant
  const handleAssistantSelect = (assistant) => {
    setSelectedAssistant(assistant);
    setAssistantDropdownOpen(false);
  };

  // ADDED: New handlers for editing and deleting conversations
  const startEditingConversation = (e, conversationId, currentTitle) => {
    e.stopPropagation(); // Prevent conversation selection when clicking edit
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle || "New Conversation");
  };

  const cancelEditingConversation = (e) => {
    if (e) e.stopPropagation();
    setEditingConversationId(null);
    setEditingTitle('');
  };

  // Modified saveConversationTitle with fallback for missing function
  const saveConversationTitle = (e) => {
    if (e) e.stopPropagation();
    if (editingConversationId && editingTitle.trim()) {
      if (functionsReady && typeof updateConversationTitle === 'function') {
        try {
          updateConversationTitle(editingConversationId, editingTitle.trim());
        } catch (error) {
          console.error("Error updating conversation title:", error);
          // Fallback: update directly in localStorage
          try {
            const storedConversations = localStorage.getItem('userConversations');
            if (storedConversations) {
              let convs = JSON.parse(storedConversations);
              convs = convs.map(conv =>
                conv.id === editingConversationId ? { ...conv, title: editingTitle.trim() } : conv
              );
              localStorage.setItem('userConversations', JSON.stringify(convs));

              // Force reload to update UI
              window.location.reload();
            }
          } catch (localError) {
            console.error("Fallback failed:", localError);
          }
        }
      } else {
        console.error("updateConversationTitle function is not available");
        // Direct localStorage fallback
        try {
          const storedConversations = localStorage.getItem('userConversations');
          if (storedConversations) {
            let convs = JSON.parse(storedConversations);
            convs = convs.map(conv =>
              conv.id === editingConversationId ? { ...conv, title: editingTitle.trim() } : conv
            );
            localStorage.setItem('userConversations', JSON.stringify(convs));

            // Force reload to update UI
            window.location.reload();
          }
        } catch (error) {
          console.error("Failed to update conversation title:", error);
          alert("Failed to update conversation title. Please try again.");
        }
      }

      setEditingConversationId(null);
      setEditingTitle('');
    }
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveConversationTitle(e);
    } else if (e.key === 'Escape') {
      cancelEditingConversation(e);
    }
  };

  // Modified handleDeleteConversation with fallback for missing function
  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation(); // Prevent conversation selection
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      if (functionsReady && typeof deleteConversation === 'function') {
        try {
          deleteConversation(conversationId);
        } catch (error) {
          console.error("Error deleting conversation:", error);
          // Fallback: delete directly in localStorage
          try {
            const storedConversations = localStorage.getItem('userConversations');
            if (storedConversations) {
              let convs = JSON.parse(storedConversations);
              convs = convs.filter(conv => conv.id !== conversationId);
              localStorage.setItem('userConversations', JSON.stringify(convs));

              // Force reload to update UI
              window.location.reload();
            }
          } catch (localError) {
            console.error("Fallback failed:", localError);
          }
        }
      } else {
        console.error("deleteConversation function is not available");
        // Direct localStorage fallback
        try {
          const storedConversations = localStorage.getItem('userConversations');
          if (storedConversations) {
            let convs = JSON.parse(storedConversations);
            convs = convs.filter(conv => conv.id !== conversationId);
            localStorage.setItem('userConversations', JSON.stringify(convs));

            // Force reload to update UI
            window.location.reload();
          }
        } catch (error) {
          console.error("Failed to delete conversation:", error);
          alert("Failed to delete conversation. Please try again.");
        }
      }

      // Handle UI updates after deletion
      if (conversationId === currentConversationId) {
        const remainingConversations = conversations.filter(c => c.id !== conversationId);
        if (remainingConversations.length > 0) {
          handleConversationSelect(remainingConversations[0].id);
        } else {
          startNewConversation();
        }
      }
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
              {/* Logo/Star that starts a new conversation when clicked */}
              <div
                className="w-8 h-8 mr-2 cursor-pointer"
                onClick={handleLogoClick}
                title="Start new conversation"
              >
                <StarLogo />
              </div>
              <div className="flex-1">
                <div className="flex items-center bg-gray-800 rounded-md px-2 py-1">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="ml-1 text-gray-400 hover:text-gray-200"
                onClick={startNewConversation}
                title="New Conversation"
              >
                <PlusCircle size={20} />
              </button>
            </div>

            {/* Sidebar tabs */}
            <div className="flex border-b border-gray-800">
              <button
                className={`flex-1 py-2 text-sm font-medium ${sidebarTab === 'recents' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                onClick={() => setSidebarTab('recents')}
              >
                History
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${sidebarTab === 'templates' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                onClick={() => setSidebarTab('templates')}
              >
                Templates
              </button>
            </div>

            {/* Conversation history tab */}
            {sidebarTab === 'recents' && (
              <div className="py-2 flex-1 overflow-y-auto">
                <div className="flex items-center px-3 py-1">
                  <ChevronDown size={16} className="text-gray-400 mr-1" />
                  <span className="text-gray-300 font-medium">Conversations</span>
                </div>

                <div className="mt-1 space-y-1 px-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`group flex items-center px-2 py-2 rounded-md hover:bg-gray-800 cursor-pointer ${conversation.id === currentConversationId ? 'bg-gray-800' : ''}`}
                      onClick={() => editingConversationId !== conversation.id && handleConversationSelect(conversation.id)}
                    >
                      <MessageSquare size={18} className="text-gray-400 mr-2 flex-shrink-0" />

                      {editingConversationId === conversation.id ? (
                        // UPDATED: Editing mode with better layout
                        <div className="flex-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={handleTitleKeyPress}
                            className="flex-1 bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={saveConversationTitle}
                            className="ml-1 p-1 rounded-full bg-green-600 text-white hover:bg-green-500"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={cancelEditingConversation}
                            className="ml-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-500"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        // UPDATED: Display mode with always visible buttons
                        <>
                          <span className="text-sm text-gray-300 truncate flex-1 pr-1">
                            {conversation.title || "New Conversation"}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              className="text-gray-500 hover:text-blue-400 p-1 rounded hover:bg-gray-700"
                              onClick={(e) => startEditingConversation(e, conversation.id, conversation.title)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-gray-700"
                              onClick={(e) => handleDeleteConversation(e, conversation.id)}
                              title="Delete"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {filteredConversations.length === 0 && (
                    <div className="text-center text-gray-500 text-sm px-2 py-4">
                      {sortedConversations.length === 0 ? "No conversations yet" : "No matching conversations"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Templates tab */}
            {sidebarTab === 'templates' && (
              <div className="py-2 flex-1 overflow-y-auto">
                {/* Recents section */}
                <div className="mb-4">
                  <div className="flex items-center px-3 py-1">
                    <ChevronDown size={16} className="text-gray-400 mr-1" />
                    <span className="text-gray-300 font-medium">Recents</span>
                  </div>

                  <div className="mt-1 space-y-1 px-2">
                    {chatOptions.filter(option => option.category === 'recents').map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center px-2 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleTemplateClick(option.title)}
                      >
                        <option.icon size={18} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300 truncate">{option.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequent section */}
                <div className="mb-4">
                  <div className="flex items-center px-3 py-1">
                    <ChevronDown size={16} className="text-gray-400 mr-1" />
                    <span className="text-gray-300 font-medium">Frequent</span>
                  </div>

                  <div className="mt-1 space-y-1 px-2">
                    {chatOptions.filter(option => option.category === 'frequent').map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center px-2 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleTemplateClick(option.title)}
                      >
                        <option.icon size={18} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300 truncate">{option.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended section */}
                <div>
                  <div className="flex items-center px-3 py-1">
                    <ChevronDown size={16} className="text-gray-400 mr-1" />
                    <span className="text-gray-300 font-medium">Recommended</span>
                  </div>

                  <div className="mt-1 space-y-1 px-2">
                    {chatOptions.filter(option => option.category === 'recommended').map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center px-2 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleTemplateClick(option.title)}
                      >
                        <option.icon size={18} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300 truncate">{option.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-gray-800 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-200 mr-3"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 flex items-center">
            <div className="relative">
              <button
                className="flex items-center bg-gray-800 rounded-md px-3 py-1.5 text-sm text-gray-300"
                onClick={() => setAssistantDropdownOpen(!assistantDropdownOpen)}
              >
                <span>{selectedAssistant}</span>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>

              {/* Assistant dropdown menu */}
              {assistantDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-md shadow-lg py-1 w-full z-10">
                  {assistantOptions.map((assistant) => (
                    <div
                      key={assistant}
                      className="px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleAssistantSelect(assistant)}
                    >
                      {assistant}
                    </div>
                  ))}
                </div>
              )}
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
                  {chatOptions.filter(option => option.category === 'recents').map((option, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 hover:bg-gray-750 p-4 rounded-md cursor-pointer"
                      onClick={() => handleTemplateClick(option.title)}
                    >
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
                  {chatOptions.filter(option => option.category === 'frequent').map((option, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 hover:bg-gray-750 p-4 rounded-md cursor-pointer"
                      onClick={() => handleTemplateClick(option.title)}
                    >
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
                  {chatOptions.filter(option => option.category === 'recommended').map((option, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 hover:bg-gray-750 p-4 rounded-md cursor-pointer"
                      onClick={() => handleTemplateClick(option.title)}
                    >
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
