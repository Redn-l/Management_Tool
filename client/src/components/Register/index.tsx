import React, { Dispatch, FC, FormEvent, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../services/AuthService';
import { NavLink, NavigateFunction, useNavigate } from 'react-router-dom';
import { EmptyProps } from '../../types';
import { AlertContext } from '../../services/AlertService';
import { Box, Button, TextField, Typography, Link, Grid, Theme, useTheme } from '@mui/material';
import { LockOpen, PersonAddAlt } from '@mui/icons-material';
import { validate } from 'email-validator';
import "./styles.css";
import { MIN_PASSWORD_LENGTH } from '../../constants';

const Register: FC<EmptyProps> = React.memo(() => {
  const [password, setPassword]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [email, setEmail]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [name, setName]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [confirmPassword, setConfirmPassword]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const theme: Theme = useTheme();
  const headerColor = useMemo(() => theme.palette.grey[800], [theme.palette.grey]);

  const navigate: NavigateFunction = useNavigate();

  const {dispatchAlert} = useContext(AlertContext);
  const { register } = useContext(AuthContext);


  const handleRegister = useCallback((e: FormEvent): void => {
    e.preventDefault();
    let error = false;
    if (!name || !email || !password) {
        error = true;
        dispatchAlert({severity: 'error', message: 'Пожалуйста, заполните все поля'});
    }
    if (!validate(email)) {
        error = true;
        dispatchAlert({severity: 'error', message: 'Пожалуйста, введите корректный email'});
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        error = true;
        dispatchAlert({severity: 'error', message: `Пароль должен содержать от ${MIN_PASSWORD_LENGTH} символов`});
    }
    if (password !== confirmPassword) {
        error = true;
        dispatchAlert({severity: 'error', message: 'Пароли не совпадают'});
    }
    if (error) return;
    register(name, email, password).then(() => {
      navigate('/');
    }).catch((error: any) => {
        dispatchAlert({severity: 'error', message: error.response?.data?.message});
    });
  }, [confirmPassword, dispatchAlert, email, name, navigate, password, register]);

  return (
    <div className='container'>
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleRegister}
            className='signup-form'
            style={{borderColor: headerColor}}
        >
            <Typography variant="h6" component="div" className='heading' style={{backgroundColor: headerColor}}><PersonAddAlt fontSize='medium' />&nbsp;Sign up</Typography>
            <div className='form-contents'>
                <Grid container className='grid' spacing={2}>
                    <Grid item xs={12} sm={6} display="flex" flexGrow="1">
                        <TextField
                            id="standard-search"
                            label="Имя пользователя"
                            type="text"
                            variant="standard"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className='grid-item'>
                        <TextField
                            id="standard-search"
                            label="Email"
                            type="email"
                            variant="standard"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className='grid-item'>
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
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className='grid-item'>
                        <TextField
                            id="standard-password-input"
                            label="Подтвреждение пароля"
                            type="password"
                            autoComplete="current-password"
                            variant="standard"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant='contained' className='signup-button' fullWidth>Sign Up</Button>
                <br />
                <br />
                <span className='login'><LockOpen />&nbsp;У вас уже есть аккаунт?&nbsp;<Link to="/login" underline="hover" component={NavLink}>Login</Link></span>
            </div>
        </Box>
    </div>
  );
});

Register.displayName = 'Register';
export default Register;
