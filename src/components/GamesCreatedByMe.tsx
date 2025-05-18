import * as React from 'react';
import axios from "axios";
import {Container, Paper, Typography} from "@mui/material";
import GameListObject from "./GameListObject";


const GamesCreatedByMe = () => {
    const [createdGames, setCreatedGames] = React.useState<Game[]>([]);
    React.useEffect(() => {
        const getGamesICreated = () => {
            const userId = localStorage.getItem("userId");
            axios.get(`http://localhost:4941/api/v1/games?creatorId=${userId}`)
                .then((response) => {
                    setCreatedGames(response.data.games);
                }, (error) => {
                });
        };
        getGamesICreated();
    }, [setCreatedGames]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#172D2D"}}>
                <div className="p-4 space-y-4">
                    <Typography variant="h5">Created by me</Typography>
                    <Container sx={{mt: 8}}>
                        {createdGames.map((game: Game) => (
                            <GameListObject game={game}/>
                        ))}
                    </Container>
                </div>
            </Paper>
        </Container>
    );

}

export default GamesCreatedByMe;