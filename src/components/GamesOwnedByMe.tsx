import * as React from 'react';
import axios from "axios";
import {Container, Paper} from "@mui/material";
import GameListObject from "./GameListObject";

const GamesOwnedByMe = () => {
    const [ownedGames, setOwnedGames] = React.useState<Game[]>([]);

    React.useEffect(() => {
        const getOwnedGames = () => {
            const token = localStorage.getItem("token");
            axios.get(`http://localhost:4941/api/v1/games?ownedByMe=true`, {
                headers: {
                    "X-Authorization": token,
                },
            })
                .then((response) => {
                    setOwnedGames(response.data.games);
                }, (error) => {
                });
        };
        getOwnedGames();
    }, [setOwnedGames]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#406262"}}>
                <div className="p-4 space-y-4">
                    <Container>
                        {ownedGames.map((game: Game) => (
                            <GameListObject game={game}/>
                        ))}
                    </Container>
                </div>
            </Paper>
        </Container>
    );

}

export default GamesOwnedByMe;