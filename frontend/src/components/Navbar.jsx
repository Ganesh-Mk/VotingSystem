import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../store/userSlice';

const Navbar = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className="w-full sticky top-0 z-10">
      {/* Navbar Container */}
      <div className="w-full bg-white shadow-md px-6 flex justify-between items-center h-20">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">VotingSystem</Link>
        </div>

        {/* Middle - Navigation Menu */}
        <div className="flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
          <Link to="/voting" className="text-gray-700 hover:text-indigo-600 font-medium">Voting</Link>
          <Link to="/news" className="text-gray-700 hover:text-indigo-600 font-medium">News</Link>
        </div>

        {/* Right Side - Conditional Auth Buttons */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <Link to="/account" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Account</Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800">Log In</Link>
              <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;