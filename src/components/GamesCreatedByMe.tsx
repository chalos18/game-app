import * as React from 'react';
import axios from "axios";
import {Container, Paper} from "@mui/material";
import GameListObject from "./GameListObject";
import {useGameStore} from "../store";

const GamesCreatedByMe = () => {
    const games = useGameStore((state) => state.games);
    const setGames = useGameStore((state) => state.setGames);

    React.useEffect(() => {
        const getGamesICreated = () => {
            const userId = localStorage.getItem("userId");
            axios.get(`http://localhost:4941/api/v1/games?creatorId=${userId}`)
                .then((response) => {
                    setGames(response.data.games);
                });
        };
        getGamesICreated();
    }, [setGames]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#406262"}}>
                <div className="p-4 space-y-4">
                    <Container>
                        {games.map(game => (
                            <GameListObject
                                key={game.gameId}
                                game={game}
                                showEditButtons={true}
                            />
                        ))}
                    </Container>
                </div>
            </Paper>
        </Container>
    );
};

export default GamesCreatedByMe;
