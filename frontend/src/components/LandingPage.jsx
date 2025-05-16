import backgroundImage from './assets/backpicture.png'; // Import the background image
import SocialLogin from './SocialLogin';
import StarLogo from './StarLogo';

const LandingPage = ({ onStartChat, onLoginSuccess, isLoggedIn, user }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Logo and content */}
      <div className="z-10 flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="w-16 h-12 text-white">
            <StarLogo />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-2 text-white">Galaxy AI</h1>
        <p className="text-3xl text-blue-400 mb-12">Your Intelligent Assistant</p>

        <div className="flex flex-col space-y-4 w-64">
          <button
            onClick={onStartChat}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg transition-colors shadow-lg shadow-blue-500/30"
          >
            Start Chatting
          </button>

          {!isLoggedIn && (
            <>
              <div className="flex items-center my-2">
                <div className="h-px bg-gray-700 flex-grow" />
                <span className="px-4 text-gray-500 text-sm">or login with</span>
                <div className="h-px bg-gray-700 flex-grow" />
              </div>

              <SocialLogin onLoginSuccess={onLoginSuccess} />
            </>
          )}

          {isLoggedIn && user && (
            <div className="mt-4 text-center">
              <p className="text-gray-300">
                Logged in as <span className="font-medium">{user.first_name || user.username}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
