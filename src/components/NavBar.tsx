import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#172D2D' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button sx={{ color: 'white' }} color="inherit" component={Link} to="/home" >Games</Button>
                    <Button sx={{ color: 'white' }} color="inherit" component={Link} to="/login">Login</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;