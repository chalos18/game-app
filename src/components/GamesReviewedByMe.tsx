import * as React from 'react';
import axios from "axios";
import {Container, Paper, Typography} from "@mui/material";
import GameListObject from "./GameListObject";

const GamesReviewedByMe = () => {
    const [reviewedGames, setReviewedGames] = React.useState<Game[]>([]);


    React.useEffect(() => {
        const getGamesIReviewed = () => {
            const userId = localStorage.getItem("userId");
            axios.get(`http://localhost:4941/api/v1/games?reviewerId=${userId}`)
                .then((response) => {
                    setReviewedGames(response.data.games);
                }, (error) => {
                });
        };
        getGamesIReviewed();
    }, [setReviewedGames]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#172D2D"}}>
                <div className="p-4 space-y-4">
                    <Container sx={{mt: 8}}>
                        <Typography variant="h5">Reviewed by me</Typography>
                        {reviewedGames.map((game: Game) => (
                            <GameListObject game={game}/>
                        ))}
                    </Container>
                </div>
            </Paper>
        </Container>
    );

}

export default GamesReviewedByMe;