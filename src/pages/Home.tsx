import React from 'react';
import { Typography, Container, Grid } from '@mui/material';
import GameListObject from '../components/GameListObject'; // Adjust the path if needed
import GameList from '../components/GameList';
import { useGameStore } from '../store';
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";

const Home = () => {
    const games = useGameStore(state => state.games); // Assuming you have a game store with a `games` list

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom></Typography>
            <SearchBar/>
            <GameList/>
        </Container>
    );
};

export default Home;
