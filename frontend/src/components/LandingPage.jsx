import SocialLogin from './SocialLogin';
import StarLogo from './StarLogo';

const LandingPage = ({ onStartChat, onLoginSuccess, isLoggedIn, user }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid with golden ratio patterns */}
      <div className="absolute inset-0 w-full h-full opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <g stroke="rgb(56, 189, 248)" strokeWidth="1" fill="none">
            <rect x="100" y="100" width="800" height="800" />
            <rect x="100" y="100" width="495" height="495" />
            <rect x="100" y="595" width="305" height="305" />
            <rect x="405" y="595" width="190" height="190" />
            <rect x="595" y="100" width="305" height="305" />
            <rect x="595" y="405" width="190" height="190" />

            {/* Circles */}
            <circle cx="500" cy="500" r="400" />
            <circle cx="500" cy="500" r="250" />
            <circle cx="500" cy="500" r="150" />

            {/* Diagonal lines */}
            <line x1="100" y1="100" x2="900" y2="900" />
            <line x1="900" y1="100" x2="100" y2="900" />
          </g>
        </svg>
      </div>

      {/* Logo and content */}
      <div className="z-10 flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center relative">
            <div className="w-12 h-12 text-white">
              <StarLogo />
            </div>

            {/* Blue dots around the circle */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-blue-400"
                style={{
                  borderRadius: i % 2 === 0 ? '2px' : '1px',
                  transform: `rotate(${i * 30}deg) translateY(-40px) ${i % 2 === 0 ? 'rotate(45deg)' : ''}`,
                }}
              />
            ))}
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

      {/* Footer */}
    </div>
  );
};

export default LandingPage;
