import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/home">Games</Button>
                    <Button color="inherit" component={Link} to="/Login">Login</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;