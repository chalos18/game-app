import React from 'react';
import { Typography, Container } from '@mui/material';
import GameList from '../components/GameList';

const Home = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom></Typography>
            <GameList/>
        </Container>
    );
};

export default Home;
