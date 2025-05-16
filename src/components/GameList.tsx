import axios from 'axios';
import React from "react";
import {Paper, AlertTitle, Alert, Grid, Container, TextField} from '@mui/material';
import GameListObject from "./GameListObject";
import { useGameStore } from "../store"

const GameList = () => {
    const games = useGameStore(state => state.games);
    const setGames = useGameStore(state => state.setGames);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")

    const [searchTerm, setSearchTerm] = React.useState("");


    React.useEffect(() => {
        const getGames = () => {
            const params = new URLSearchParams();
            if (searchTerm) params.append("q", searchTerm);
            axios.get(`http://localhost:4941/api/v1/games?${params.toString()}`)
                .then((response) => {
                    console.log(response.data.games);
                    setErrorFlag(false);
                    setErrorMessage("");
                    setGames(response.data.games);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(
                        error.toString()
                    );
                });
        };
        getGames();
    }, [searchTerm, setGames]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#172D2D"}}>
                <div className="p-4 space-y-4">
                    <TextField
                        label="Search games"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: "white" }}
                    />
                    {errorFlag && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    )}
                    <Grid container spacing={3} justifyContent="center">
                        {games.map((game: Game) => (
                            <Grid key={game.gameId}>
                                <GameListObject game={game} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Paper>
        </Container>
    );
};

export default GameList;
