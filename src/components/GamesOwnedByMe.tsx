import * as React from 'react';
import axios from "axios";
import {Container, Paper} from "@mui/material";
import GameListObject from "./GameListObject";
import Box from '@mui/material/Box';

const GamesOwnedByMe = () => {
    const [ownedGames, setOwnedGames] = React.useState<Game[]>([]);

    React.useEffect(() => {
        const getOwnedGames = () => {
            axios.get(`http://localhost:4941/api/v1/games?ownedByMe=true`)
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
                    {ownedGames.map((game: Game) => (
                        <Box sx={{
                            borderBottom: "1px solid #ddd",
                            padding: "10px 0",
                            display: 'flex',
                            alignItems: 'flex-start'
                        }}>
                            <GameListObject game={game}/>
                        </Box>
                    ))}
                </div>
            </Paper>
        </Container>
    );

}

export default GamesOwnedByMe;