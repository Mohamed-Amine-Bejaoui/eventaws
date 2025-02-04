// RoutesConfig.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import Adhome from './admin/adhome';
import Home from './users/home';
Amplify.configure(awsconfig);

const RoutesConfig = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const currentUser = await Amplify.Auth.currentUserInfo();
        setEmail(currentUser?.attributes?.email);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserEmail();
  }, []);

  if (!email) {
    return null; // or a loading spinner
  }

  return (
    <Routes>
      {email === 'aminebejoauiaa@gmail.com' ? (
        <>
          <Route path="/admin" element={<Adhome />} />
          <Route path="/" element={<Navigate to="/admin" />} />
        </>
      ) : (
        <>
          <Route path="/user" element={<Home />} />
          <Route path="/" element={<Navigate to="/user" />} />
        </>
      )}
    </Routes>
  );
};

export default RoutesConfig;
