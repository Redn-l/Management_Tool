import React, { Dispatch, FC, FormEvent, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../services/AuthService';
import { NavLink, NavigateFunction, useNavigate } from 'react-router-dom';
import { EmptyProps } from '../../types';
import { Box, Button, Link, TextField, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './styles.css';
import { AlertContext } from '../../services/AlertService';
import { LockOpen, PersonAddAlt } from '@mui/icons-material';

const Login: FC<EmptyProps> = React.memo(() => {
  const [email, setEmail]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [password, setPassword]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const theme: Theme = useTheme();
  const headerColor = useMemo(() => theme.palette.grey[800], [theme.palette.grey]);

  const navigate: NavigateFunction = useNavigate();
  const {dispatchAlert} = useContext(AlertContext);
  const {login, token} = useContext(AuthContext);

  useEffect((): void => {
    if (Boolean(token)) {
        navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = useCallback((e: FormEvent): void => {
    e.preventDefault();
    if (!email || !password) {
        dispatchAlert({severity: 'error', message: 'Please enter credentials'});
        return
    }
    login(email, password).then(() => {
        navigate('/');
    }).catch((error) => {
        dispatchAlert({severity: 'error', message: error.response?.data?.message});
    });
  }, [dispatchAlert, email, login, navigate, password]);

  return (
    <div className='container'>
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleLogin}
            className='login-form'
            style={{borderColor: headerColor}}
        >
            <Typography variant="h6" component="div" className='heading' style={{backgroundColor: headerColor}}><LockOpen fontSize='small' />&nbsp;Login</Typography>
            <div className='form-contents'>
                <TextField
                    id="standard-search"
                    label="Email"
                    type="text"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <br />
                <TextField
                    id="standard-password-input"
                    label="Пароль"
                    type="password"
                    autoComplete="current-password"
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                <br />
                <Button type="submit" variant='contained'>Login</Button>
                <br />
                <br />
                <span className='register'><PersonAddAlt />&nbsp;Новый пользователь?&nbsp;<Link to="/register" underline="hover" component={NavLink}>Signup</Link></span>
            </div>
        </Box>
    </div>
  );
});
Login.displayName = 'Login';

export default Login;