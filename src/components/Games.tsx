import axios from "axios";
import React from "react";
import {
    Alert,
    AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CSS from "csstype";

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
};

interface Game {
    gameId: number;
    title: string;
    genreId: number;
    creationDate: string;
    creatorId: number;
    price: number;
    creatorFirstName: string;
    creatorLastName: string;
    rating: number;
    platformIds: number[];
}

interface HeadCell {
    id: keyof Game | "actions";
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: "gameId", label: "ID", numeric: true },
    { id: "title", label: "Title", numeric: false },
    { id: "genreId", label: "Genre ID", numeric: true },
    { id: "creationDate", label: "Creation Date", numeric: false },
    { id: "creatorId", label: "Creator ID", numeric: true },
    { id: "price", label: "Price", numeric: true },
    { id: "creatorFirstName", label: "Creator First", numeric: false },
    { id: "creatorLastName", label: "Creator Last", numeric: false },
    { id: "rating", label: "Rating", numeric: true },
    { id: "platformIds", label: "Platform Ids", numeric: true },
    { id: "actions", label: "", numeric: false },
];

const Games = () => {
    const [games, setGames] = React.useState<Game[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [newTitle, setNewTitle] = React.useState("");
    const [newDescription, setNewDescription] = React.useState("");
    const [newGenreId, setNewGenreId] = React.useState<number | null>(null);
    const [newPrice, setNewPrice] = React.useState<number | null>(null);
    const [newPlatformIds, setNewPlatformIds] = React.useState<string>("");

    React.useEffect(() => {
        getGames();
    }, []);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const getGames = () => {
        axios
            .get("http://localhost:4941/api/v1/games")
            .then((response) => {
                setGames(response.data.games);
                setErrorFlag(false);
                setErrorMessage("");
            })
            .catch((error) => {
                showSnackbar("Error getting games: " + error.toString(), "error");
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    const handleDeleteDialogOpen = (game: Game) => {
        setDialogGame(game);
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setDialogGame(null);
        setOpenDeleteDialog(false);
    };

    const deleteGame = (gameId: number) => {
        axios
            .delete(`http://localhost:4941/api/v1/games/${gameId}`)
            .then(() => {
                getGames();
                showSnackbar("Game deleted successfully", "success");
            })
            .catch((error) => {
                showSnackbar("Error deleting game: " + error.toString(), "error");
            })
            .finally(() => {
                handleDeleteDialogClose();
            });
    };

    const addGame = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTitle || !newDescription || !newGenreId || !newPrice || !newPlatformIds) {
            showSnackbar("Please fill out all fields", "warning");
            return;
        }

        const platformIdsArray = newPlatformIds.split(",").map((id) => parseInt(id.trim()));

        axios
            .post("http://localhost:4941/api/v1/games", {
                title: newTitle,
                description: newDescription,
                genreId: newGenreId,
                price: newPrice,
                platformIds: platformIdsArray,
            })
            .then(() => {
                getGames();
                showSnackbar("Game added successfully", "success");
                setNewTitle("");
                setNewDescription("");
                setNewGenreId(null);
                setNewPrice(null);
                setNewPlatformIds("");
            })
            .catch((error) => {
                showSnackbar("Error adding game: " + error.toString(), "error");
            });
    };

    const game_rows = () =>
        games.map((row: Game) => (
            <TableRow hover tabIndex={-1} key={row.gameId}>
                <TableCell align="right">{row.gameId}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell align="right">{row.genreId}</TableCell>
                <TableCell>{row.creationDate}</TableCell>
                <TableCell align="right">{row.creatorId}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell>{row.creatorFirstName}</TableCell>
                <TableCell>{row.creatorLastName}</TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right">{row.platformIds.join(", ")}</TableCell>
                <TableCell align="right">
                    <Link to={`/games/${row.gameId}`}>View game</Link>&nbsp;|&nbsp;
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteDialogOpen(row)}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="outlined"
                        // onClick={() => handleDeleteDialogOpen(row)}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                </TableCell>
            </TableRow>
        ));

    return (
        <div>
            {errorFlag && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}

            <Snackbar autoHideDuration={5000}
                      open={snackOpen}
                      onClose={handleSnackClose}
                      key={snackMessage}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: "100%" }}>
                    {snackMessage}
                </Alert>
            </Snackbar>

            <Paper elevation={3} style={card}>
                <h1>Add a new game</h1>
                <form onSubmit={addGame}>
                    <Stack spacing={2}>
                        <TextField label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                        <TextField
                            label="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <TextField
                            label="Genre ID"
                            type="number"
                            value={newGenreId ?? ""}
                            onChange={(e) => setNewGenreId(parseInt(e.target.value))}
                        />
                        <TextField
                            label="Price"
                            type="number"
                            value={newPrice ?? ""}
                            onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                        />
                        <TextField
                            label="Platform IDs (comma-separated)"
                            value={newPlatformIds}
                            onChange={(e) => setNewPlatformIds(e.target.value)}
                        />
                        <Button variant="contained" type="submit">
                            Add Game
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Paper elevation={3} style={card}>
                <h1>Games</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? "right" : "left"}
                                        padding="normal"
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>{game_rows()}</TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
                <DialogTitle>Delete Game?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the game{" "}
                        <strong>{dialogGame?.title}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => dialogGame && deleteGame(dialogGame.gameId)}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Games;
