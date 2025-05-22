import * as React from 'react';
import axios from "axios";
import {Alert, Container, Paper, Snackbar} from "@mui/material";
import GameListObject from "./GameListObject";

const GamesOwnedByMe = () => {
    const [ownedGames, setOwnedGames] = React.useState<Game[]>([]);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

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
                }, () => {
                    // showSnackbar("Getting games failed", "error");
                });
        };
        getOwnedGames();
    }, [setOwnedGames]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Snackbar autoHideDuration={5000}
                      open={snackOpen}
                      onClose={handleSnackClose}
                      key={snackMessage}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#DAE7E7"}}>
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