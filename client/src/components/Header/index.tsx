import { AppBar, IconButton, Menu, MenuItem, Theme, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { AccountCircle, ListAlt, Logout } from '@mui/icons-material';
import React, { useState, MouseEvent, useContext, useCallback } from "react";
import "./styles.css";
import { AuthContext } from "../../services/AuthService";

const Header = React.memo(() => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const { token, logout, user } = useContext(AuthContext);
    const isAuthenticated = Boolean(token);

    const theme: Theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true});
    
    const handleMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setOpenMenu(false);
    }, []);

    return <AppBar position="fixed" style={{ backgroundColor: '#0d1b2a' }}>


        <Toolbar>
            <Typography variant="h6" component="div" className="header-text"><ListAlt />&nbsp;Менеджер{isSmallScreen ? '' : ' задач'}</Typography>
            {isAuthenticated ? (
            <div className="user-info">
                <span>{isSmallScreen ? '' : 'Ваш профиль, '}{user.name}</span>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={openMenu}
                    onClose={handleClose}
                >
                    <MenuItem onClick={logout}><Logout />&nbsp;Выход</MenuItem>
                </Menu>
            </div>
          ) : null}
        </Toolbar>
    </AppBar>
});

Header.displayName = 'Header';
export default Header;
