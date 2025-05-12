import axios from "axios";
import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { Link } from "react-router-dom";

const Games = () => {
    const [games, setGames] = React.useState<Game[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    React.useEffect(() => {
        getGames();
    }, []);

    const getGames = () => {
        axios.get("http://localhost:4941/api/v1/games")
            .then((response) => {
                setGames(response.data.games);
                setErrorFlag(false);
                setErrorMessage("");
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
        axios.delete(`http://localhost:4941/api/v1/games/${gameId}`)
            .then(() => {
                getGames();
                handleDeleteDialogClose();
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
            .finally(() => {
                handleDeleteDialogClose();
            });
    };

    return (
        <div>
            <h1>Games</h1>
            {errorFlag && <div style={{ color: "red" }}>{errorMessage}</div>}
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Creation Date</th>
                    <th>Creator First</th>
                    <th>Creator Last</th>
                    <th>Creator ID</th>
                    <th>Genre ID</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {games.map((game) => (
                    <tr key={game.gameId}>
                        <td>{game.gameId}</td>
                        <td>{game.title}</td>
                        <td>{game.creationDate}</td>
                        <td>{game.creatorFirstName}</td>
                        <td>{game.creatorLastName}</td>
                        <td>{game.creatorId}</td>
                        <td>{game.genreId}</td>
                        <td>{game.price}</td>
                        <td>{game.rating}</td>
                        <td>
                            <Link to={`/games/${game.gameId}`}>Go to game</Link>
                            &nbsp;|&nbsp;
                            <Button onClick={() => handleDeleteDialogOpen(game)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Delete confirmation dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Game?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the game <strong>{dialogGame?.title}</strong>?
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
