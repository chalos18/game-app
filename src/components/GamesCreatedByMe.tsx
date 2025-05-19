import * as React from 'react';
import {useRef, useState} from 'react';
import axios from "axios";
import {Container, Paper} from "@mui/material";
import GameListObject from "./GameListObject";
import {useNavigate} from "react-router-dom";
import {useGameStore} from "../store";


const GamesCreatedByMe = () => {
    const [createdGames, setCreatedGames] = React.useState<Game[]>([]);

    const games = useGameStore((state) => state.games);
    const setGames = useGameStore((state) => state.setGames);

    // const [game] = React.useState<Game>(props.game)

    // const [games, setGames] = React.useState<Game[]>([]);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");


    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [gamePicture, setGamePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
                        {/*{createdGames.map((game: Game) => {*/}
                        {/*    return <GameListObject key={game.gameId} game={game} showEditButtons={true}/>;*/}
                        {/*})}*/}

                        {games.map(game => (
                            <GameListObject
                                key={game.gameId}
                                game={game}
                                showEditButtons={true}
                                // onDelete={() => {
                                //     setGames(prev => prev.filter(g => g.gameId !== game.gameId));
                                // }}
                            />
                        ))}


                    </Container>
                </div>
            </Paper>
        </Container>
    );

}

export default GamesCreatedByMe;