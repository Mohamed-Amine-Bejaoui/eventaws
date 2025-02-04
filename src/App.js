import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator, ThemeProvider, createTheme, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import EventsAD from './components/admin/events';
import Adhome from './components/admin/adhome';
import Home from './components/users/home';
import EventsUs from './components/users/events';

Amplify.configure(awsconfig);

const customTheme = createTheme({
  name: 'custom-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#ffffff' },
      },
      brand: {
        primary: { value: '#1e3a8a' },
      },
    },
    components: {
      button: {
        borderRadius: { value: '10px' },
        fontSize: { value: '16px' },
      },
      text: {
        color: { value: '#333' },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Router>
        <View className="app-container">
          <Authenticator>
            {({ signOut, user }) => {
              if (!user) {
                return <div>Loading...</div>;
              }

              const email = user.signInDetails.loginId;
              const isAdmin = email === 'aminebejaouiaa@gmail.com';

              return (
                <Routes>
                  <>
                    {/* Admin Route */}
                    <Route path="/admin" element={isAdmin ? <Adhome  isAdmin={true} email={email} /> : <Navigate to="/user" />} />
                    
                    {/* User Route */}
                    <Route path="/user" element={!isAdmin ? <Adhome isAdmin={false} email={email} /> : <Navigate to="/admin" />} />
                    
                    {/* Default Route - Redirect to Admin or User */}
                    <Route path="/" element={isAdmin ? <Navigate to="/admin" /> : <Navigate to="/user" />} />
                    
                    {/* Events Route */}
                    <Route path="/events" element={isAdmin ? <EventsAD /> : <EventsUs />} />
                  </>
                </Routes>
              );
            }}
          </Authenticator>
        </View>
      </Router>
    </ThemeProvider>
  );
}

export default App;
