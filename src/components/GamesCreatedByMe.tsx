import * as React from 'react';
import {useRef, useState} from 'react';
import axios from "axios";
import {Container, Paper, Typography} from "@mui/material";
import GameListObject from "./GameListObject";
import {useNavigate} from "react-router-dom";


const GamesCreatedByMe = () => {
    const [createdGames, setCreatedGames] = React.useState<Game[]>([]);

    // const [game] = React.useState<Game>(props.game)

    const [games, setGames] = React.useState<Game[]>([]);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");


    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [gamePicture, setGamePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        console.log("Snackbar triggered:", message);
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const parseValidationError = (message: string): { [key: string]: string } => {
        const rules: { [key: string]: [string, string] } = {
            "data/genreId must be >= 0": ["genreId", "Genre ID must be non-negative"],
            "No genre with id": ["genreId", "Genre ID must reference an existing genre"],
            "data/platformIds must be array": ["platformIds", "Platform IDs must be comma-separated"],
            "data/price must be integer": ["price", "Price must be a number"],
            "data/price must be >= 0": ["price", "Price must be non-negative"],
            "Duplicate petition": ["title", "Game already exists"],
            "No platform with id": ["platformIds", "Platform ID must reference an existing platform"],
            "data/platformIds must NOT have fewer than 1 items": ["platformIds", "Game must have at least one Platform"],
        };

        const result: { [key: string]: string } = {};

        const parts = message.split(/[,;]+/).map(part => part.trim());

        for (const part of parts) {
            for (const key in rules) {
                if (part.includes(key)) {
                    const [field, text] = rules[key];
                    result[field] = text;
                }
            }
        }

        return result;
    };

    React.useEffect(() => {
        const getGamesICreated = () => {
            const userId = localStorage.getItem("userId");
            // this endpoint does not return a description
            axios.get(`http://localhost:4941/api/v1/games?creatorId=${userId}`)
                .then((response) => {
                    console.log("Game Description:", response.data.games);
                    setCreatedGames(response.data.games);
                }, (error) => {
                });
        };
        getGamesICreated();
    }, [setCreatedGames]);


    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#406262"}}>
                <div className="p-4 space-y-4">
                    <Container>
                        {createdGames.map((game: Game) => {
                            console.log("Game Description:", game.description);
                            return <GameListObject key={game.gameId} game={game} showEditButtons={true}/>;
                        })}

                    </Container>
                </div>
            </Paper>
        </Container>
    );

}

export default GamesCreatedByMe;