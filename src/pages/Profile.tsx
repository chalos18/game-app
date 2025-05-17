import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateGame from "../components/CreateGame";

function Profile() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4">User Profile</Typography>
            <Typography sx={{ mt: 2 }}>User ID: {userId}</Typography>
            <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate("/home")}
            >
                Back to Games
            </Button>
            <CreateGame />
        </Container>
    );
}

export default Profile;
