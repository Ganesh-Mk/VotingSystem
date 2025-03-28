import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const redirect = () => {
    const isLoggedIn = localStorage.getItem('isLogin')
    if (isLoggedIn === "true") {
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    axios.get(`${BACKEND_URL}/auth/current_user`, { withCredentials: true })
      .then(res => console.log(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      HI
    </div>
  );
};

export default HomePage;