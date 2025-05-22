import axios from 'axios';
import React from "react";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Typography
} from '@mui/material';
import GameListObject from "./GameListObject";
import {useGameStore} from "../store";
import GameFilters from "./GameFiltering";

const GameList = () => {
    const games = useGameStore(state => state.games);
    const setGames = useGameStore(state => state.setGames);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalGames, setTotalGames] = React.useState(0);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [selectedGenres, setSelectedGenres] = React.useState<number[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = React.useState<number[]>([]);
    const [maxPrice, setMaxPrice] = React.useState<number>(25000);

    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);


    const totalPages = Math.ceil(totalGames / pageSize);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    }

    const getGenres = () => {
        axios
            .get("http://localhost:4941/api/v1/games/genres")
            .then((response) => setGenres(response.data))
            .catch((error) => {
                showSnackbar("Error getting genres: " + error.toString(), "error");
            });
    };

    const getPlatforms = () => {
        axios
            .get("http://localhost:4941/api/v1/games/platforms")
            .then((response) => {
                setPlatforms(response.data)
            })
            .catch((error) => {
                showSnackbar("Error getting platforms: " + error.toString(), "error");
            });
    };


    const getGames = React.useCallback(() => {
        const params = new URLSearchParams();
        params.append("startIndex", String((currentPage - 1) * pageSize));
        params.append("count", String(pageSize));
        if (searchTerm) params.append("q", searchTerm);

        if (selectedGenres.length > 0) {
            selectedGenres.forEach(id => params.append("genreIds", String(id)));
        }
        if (selectedPlatforms.length > 0) {
            selectedPlatforms.forEach(id => params.append("platformIds", String(id)));
        }
        if (maxPrice >= 0) {
            params.append("price", String(maxPrice));
        }

        console.log(params.toString());

        axios.get(`http://localhost:4941/api/v1/games?${params.toString()}`)
            .then((response) => {
                setGames(response.data.games);
                setTotalGames(response.data.count);
            }, () => {
                setGames([]);
                setTotalGames(0);
                showSnackbar("Getting games failed", "error");
            });
    }, [currentPage, pageSize, searchTerm, selectedGenres, selectedPlatforms, maxPrice, setGames]);


    React.useEffect(() => {
        getGames();
    }, [getGames]);

    React.useEffect(() => {
        getGenres();
        getPlatforms();
    }, []);

    const goToFirst = () => setCurrentPage(1);
    const goToLast = () => setCurrentPage(totalPages);
    const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handlePageSizeChange = (e: any) => {
        setPageSize(e.target.value);
        setCurrentPage(1);
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
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

            <Paper elevation={3} sx={{p: 3, backgroundColor: "#DAE7E7"}}>
                <Box className="p-4 space-y-4">

                    <GameFilters
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        genres={genres}
                        platforms={platforms}
                        selectedGenres={selectedGenres}
                        selectedPlatforms={selectedPlatforms}
                        price={maxPrice}
                        onGenresChange={setSelectedGenres}
                        onPlatformsChange={setSelectedPlatforms}
                        onPriceChange={setMaxPrice}
                        setCurrentPage={setCurrentPage}
                    />

                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel>Page size</InputLabel>
                        <Select
                            value={pageSize}
                            label="Page size"
                            onChange={handlePageSizeChange}
                        >
                            {[5, 6, 7, 8, 9, 10].map(size => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Grid container spacing={3} justifyContent="center">
                        {games.map((game: Game) => (
                            <Grid key={game.gameId}>
                                <GameListObject game={game} />
                            </Grid>
                        ))}
                    </Grid>

                    <Box style={{marginTop: 24, textAlign: "center"}}>
                        <Typography variant="body1">
                            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                        </Typography>

                        <ButtonGroup sx={{ mt: 2 }}>
                            <Button onClick={goToFirst} disabled={currentPage === 1}>First</Button>
                            <Button onClick={goToPrev} disabled={currentPage === 1}>Previous</Button>
                            <Button onClick={goToNext} disabled={currentPage === totalPages}>Next</Button>
                            <Button onClick={goToLast} disabled={currentPage === totalPages}>Last</Button>
                        </ButtonGroup>

                        {totalPages === 0 && (
                            <Typography sx={{mt: 2}}>No games available</Typography>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};


export default GameList;
