import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../api';

const UserProfile = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
    setShowDropdown(false);
  };

  // Get first letter of username or email for avatar
  const getInitial = () => {
    if (!user) return 'U';
    if (user.first_name) return user.first_name.charAt(0);
    if (user.email) return user.email.charAt(0);
    return user.username.charAt(0);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium"
      >
        {user?.profile?.avatar ? (
          <img
            src={user.profile.avatar}
            alt="User avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitial().toUpperCase()
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-60 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium mr-3">
                {user?.profile?.avatar ? (
                  <img
                    src={user.profile.avatar}
                    alt="User avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitial().toUpperCase()
                )}
              </div>
              <div>
                <div className="text-white font-medium">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
                </div>
                <div className="text-gray-400 text-sm">{user?.email || ''}</div>
              </div>
            </div>
          </div>


          <div className="py-1 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              <LogOut size={16} className="mr-2" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
