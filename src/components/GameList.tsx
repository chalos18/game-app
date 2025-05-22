import axios from 'axios';
import React from "react";
import {
    Alert,
    AlertTitle,
    Container,
    Grid,
    Paper,
    TextField,
    Button,
    ButtonGroup,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar
} from '@mui/material';
import GameListObject from "./GameListObject";
import { useGameStore } from "../store";

const GameList = () => {
    const games = useGameStore(state => state.games);
    const setGames = useGameStore(state => state.setGames);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [searchTerm, setSearchTerm] = React.useState("");

    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const totalPages = Math.ceil(games.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentGames = games.slice(startIndex, endIndex);

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
        const getGames = () => {
            const params = new URLSearchParams();
            if (searchTerm) params.append("q", searchTerm);
            axios.get(`http://localhost:4941/api/v1/games?${params.toString()}`)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setGames(response.data.games);
                    setCurrentPage(1);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getGames();
    }, [searchTerm, setGames]);

    const goToFirst = () => setCurrentPage(1);
    const goToLast = () => setCurrentPage(totalPages);
    const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Snackbar
                open={snackOpen}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                style={{zIndex: 9999}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#172D2D" }}>
                <div className="p-4 space-y-4">
                    <TextField
                        label="Search games"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: "white" }}
                    />

                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel>Page size</InputLabel>
                        <Select
                            value={pageSize}
                            label="Page size"
                            onChange={(e) => {
                                setPageSize(e.target.value);
                                setCurrentPage(1);
                            }}
                            sx={{ backgroundColor: "white" }}
                        >
                            {[5, 6, 7, 8, 9, 10].map(size => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {errorFlag && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    )}

                    <Grid container spacing={3} justifyContent="center">
                        {currentGames.map((game: Game) => (
                            <Grid key={game.gameId}>
                                <GameListObject game={game} />
                            </Grid>
                        ))}
                    </Grid>

                    <div style={{ marginTop: 24, textAlign: "center" }}>
                        <Typography variant="body1" color="white">
                            Page {currentPage} of {totalPages}
                        </Typography>

                        <ButtonGroup sx={{ mt: 2 }}>
                            <Button sx={{color: "white"}} onClick={goToFirst} disabled={currentPage === 1}>First</Button>
                            <Button sx={{color: "white"}} onClick={goToPrev} disabled={currentPage === 1}>Previous</Button>
                            <Button sx={{color: "white"}} onClick={goToNext} disabled={currentPage === totalPages}>Next</Button>
                            <Button sx={{color: "white"}} onClick={goToLast} disabled={currentPage === totalPages}>Last</Button>
                        </ButtonGroup>

                        {totalPages === 0 && (
                            <Typography sx={{ mt: 2 }} color="white">No games available</Typography>
                        )}
                    </div>
                </div>
            </Paper>
        </Container>
    );
};

export default GameList;
