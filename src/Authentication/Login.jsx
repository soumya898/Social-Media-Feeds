import  { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Login = ({ setShowModal }) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in with Google:', result.user);
      setSuccessMessage('User signed in with Google!');
      
      // Close modal and redirect to profile page after successful login
      if (setShowModal) setShowModal(false); // Close modal if function is available
      navigate('/feed'); // Redirect to profile page
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Error signing in with Google: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-end items-center sm:justify-center sm:py-12 custom-login">
      <div className="bg-white p-5 sm:p-8 rounded-t-lg sm:rounded-lg shadow-lg w-full sm:w-100 md:w-80 lg:w-96 xl:w-96 text-center mx-auto sm:mb-0 mb-0">
        <h2 className="text-2xl font-bold text-gray-900 my-2 flex items-center justify-center" style={{fontFamily:'karla',fontSize:'32px'}}>
          <img src='https://github.com/soumya898/Social-Media-Feeds/blob/master/public/logo.png' className="logo-icon"/>
          Vibesnap
        </h2>
        <p className="text-md text-gray-600 mb-6">Moments That Matter, Shared Forever.</p>

        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500 flex items-center justify-center gap-2 mb-4"
          style={{
            background: 'linear-gradient(90deg, #292929 0%, #444444 100%)',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1_311)">
              <path
                d="M17.5818 9.1684C17.5818 8.43095 17.5219 7.8928 17.3924 7.33473H8.97144V10.6632H13.9144C13.8147 11.4904 13.2766 12.7361 12.0807 13.5732L12.0639 13.6846L14.7265 15.7473L14.911 15.7657C16.6051 14.201 17.5818 11.899 17.5818 9.1684Z"
                fill="#4285F4"
              />
              <path
                d="M8.96944 17.9384C11.3911 17.9384 13.424 17.1411 14.909 15.7659L12.0787 13.5734C11.3213 14.1016 10.3048 14.4703 8.96944 14.4703C6.59763 14.4703 4.58458 12.9057 3.86699 10.7432L3.7618 10.7521L0.993237 12.8947L0.957031 12.9954C2.43193 15.9253 5.4615 17.9384 8.96944 17.9384Z"
                fill="#34A853"
              />
              <path
                d="M3.86663 10.7429C3.67729 10.1848 3.56771 9.58686 3.56771 8.96902C3.56771 8.35111 3.67729 7.75319 3.85667 7.19512L3.85166 7.07627L1.0484 4.89923L0.956679 4.94286C0.348802 6.15868 0 7.524 0 8.96902C0 10.414 0.348802 11.7793 0.956679 12.9951L3.86663 10.7429Z"
                fill="#FBBC05"
              />
              <path
                d="M8.96944 3.46802C10.6536 3.46802 11.7897 4.19551 12.4375 4.80346L14.9687 2.33196C13.4141 0.886947 11.3911 0 8.96944 0C5.4615 0 2.43193 2.01305 0.957031 4.94292L3.85702 7.19519C4.58458 5.03265 6.59763 3.46802 8.96944 3.46802Z"
                fill="#EB4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_311)">
                <rect width="17.5896" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Continue with Google
        </button>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .custom-login {
            justify-content: flex-end;
            height: 30%;
          }
          .custom-login > div {
            width: 100vw;
            border-top-left-radius: 2rem;
            border-top-right-radius: 2rem;
            margin-bottom: 0;
            margin-top: auto;
            padding-bottom: 7rem;
          }
        }
        .logo-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right:5px; // Space between the icon and the text
        }
      `}</style>
    </div>
  );
};


export default Login;
