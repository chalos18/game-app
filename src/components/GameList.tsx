import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import { Paper, AlertTitle, Alert } from "@mui/material";
import GameListObject from "./GameListObject";
import { useGameStore } from "../store"

const GameList = () => {
    // const [games, setGames] = React.useState<Array<Game>>([]);
    const games = useGameStore(state => state.games);
    const setGames = useGameStore(state => state.setGames);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");


    React.useEffect(() => {
        const getGames = () => {
            axios.get("http://localhost:4941/api/v1/games")
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setGames(response.data.games);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(
                        error.toString() + " defaulting to old games, changes app may not work as expected"
                    );
                });
        };
        getGames();
    }, [setGames]);

    const game_rows = () =>
        games.map((game: Game) => (
            <GameListObject key={game.gameId + game.title} game={game} />
        ));

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content",
    };

    return (
        <Paper elevation={3} style={card}>
            <h1>Game List</h1>
            <div style={{ display: "inline-block", maxWidth: "965px", minWidth: "320px" }}>
                {errorFlag ? (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                ) : null}
                {game_rows()}
            </div>
        </Paper>
    );
};

export default GameList;
