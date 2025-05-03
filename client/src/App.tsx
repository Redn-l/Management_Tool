import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';
import AuthRoute from './components/AuthRoute';
import './App.css';
import { AlertProvider } from './services/AlertService';
import AlertContainer from './components/AlertContainer';
import Header from './components/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './services/AuthService';
import { LoaderProvider } from './services/LoaderService';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = React.memo(() => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AlertProvider>
        <AuthProvider>
          <LoaderProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route index element={<AuthRoute><Tasks /></AuthRoute>} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
              </Routes>
              <AlertContainer />
            </BrowserRouter>
          </LoaderProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
});

App.displayName = 'App';
export default App;
