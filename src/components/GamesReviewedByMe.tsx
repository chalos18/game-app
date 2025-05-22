import * as React from 'react';
import axios from "axios";
import {Container, Paper} from "@mui/material";
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
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#DAE7E7"}}>
                <div className="p-4 space-y-4">
                    <Container>
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