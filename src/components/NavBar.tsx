import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        handleClose();
        navigate("/login");
    };

    return (
        <AppBar position="static" sx={{backgroundColor: '#172D2D'}}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}></Typography>
                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                    <Button sx={{color: 'white'}} component={Link} to="/home">Games</Button>
                    {!isLoggedIn ? (
                        <Button sx={{color: 'white'}} component={Link} to="/login">Login</Button>
                    ) : (
                        <>
                            <IconButton
                                size="large"
                                aria-label="account"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {
                                    handleClose();
                                    navigate('/profile');
                                }}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
