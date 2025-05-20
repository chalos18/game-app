import * as React from 'react';
import axios from "axios";
import {Container, Paper} from "@mui/material";
import GameListObject from "./GameListObject";
import Box from '@mui/material/Box';


const GamesWishlistedByMe = () => {
    const [wishlistedGames, setWishlistedGames] = React.useState<Game[]>([]);


    React.useEffect(() => {
        const getWishlistedGames = () => {
            axios.get(`http://localhost:4941/api/v1/games?wishlistedByMe=true`, {
                headers: {
                    "X-Authorization": localStorage.getItem("token")
                },
            })
                .then((response) => {
                    setWishlistedGames(response.data.games);
                }, (error) => {
                });
        };
        getWishlistedGames();
    }, [setWishlistedGames]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#406262"}}>
                <div className="p-4 space-y-4">
                    <Container>
                        {wishlistedGames.map((game: Game) => (
                            <GameListObject game={game}/>
                        ))}
                    </Container>
                </div>
            </Paper>
        </Container>
    );

}

export default GamesWishlistedByMe;