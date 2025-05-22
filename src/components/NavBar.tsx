import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Alert, AppBar, Box, Button, IconButton, Menu, MenuItem, Snackbar, Toolbar, Typography} from '@mui/material';
import axios from "axios";
import fallbackAvatar from "../assets/fallback-avatar.png";
import {useUserContext} from "../contexts/UserContext";

function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const {avatarUrl, setAvatarUrl} = useUserContext();

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
            headers: {
                "X-Authorization": token,
            },
        }).then(() => {
            setIsLoggedIn(true);
        }).catch((error) => {
            if (error.response?.status === 401 || error.response?.status === 404) {
                localStorage.clear();
                setIsLoggedIn(false);
                navigate("/login");
            } else {
                console.error("Unexpected error verifying user", error);
            }
        });
    }, [navigate]);


    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        axios.post(`http://localhost:4941/api/v1/users/logout`, null, {
            headers: {
                "X-Authorization": token,
            },
        })
            .then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("myGamesSelectedTab");
                localStorage.clear();

                showSnackbar("User logged out successfully", "success");

                setIsLoggedIn(false);
                handleClose();
                navigate("/login");

                setTimeout(() => {
                    window.location.href = "/login";
                }, 500);
            })
            .catch((error) => {
                const backendMessage = error.response || "Logout failed";
                console.log(backendMessage)
                showSnackbar("Logout failed", "error");
            })
    };


    React.useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios
            .get(`http://localhost:4941/api/v1/users/${userId}/image`, {
                responseType: 'blob'
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setAvatarUrl(url);
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    setAvatarUrl(null);
                } else {
                    setAvatarUrl(fallbackAvatar);
                }
            });
    }, []);


    return (
        <AppBar position="static" sx={{backgroundColor: '#172D2D'}}>
            <Snackbar autoHideDuration={5000}
                      open={snackOpen}
                      onClose={handleSnackClose}
                      key={snackMessage}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}></Typography>
                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                    <Button sx={{color: 'white'}} component={Link} to="/home">Games</Button>
                    {!isLoggedIn ? (
                        <Button sx={{color: 'white'}} component={Link} to="/login">Log in</Button>
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
                                <img
                                    src={avatarUrl || fallbackAvatar}
                                    alt="Creator"
                                    width={50}
                                    height={50}
                                    style={{borderRadius: "10%", objectFit: "cover", marginRight: 8}}
                                />
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
