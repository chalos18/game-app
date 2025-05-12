import axios from "axios";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

const Game = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [game, setGame] = React.useState<Game>({
        creationDate: "",
        creatorFirstName: "",
        creatorId: 0,
        creatorLastName: "",
        genreId: 0,
        price: 0,
        rating: 0,
        gameId: 0,
        title: ""
    });

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const getGame = () => {
        axios.get(`http://localhost:4941/api/v1/games/${id}`)
            .then((response) => {
                setGame(response.data);
                setErrorFlag(false);
                setErrorMessage("");
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const handleDeleteDialogClose = () => {
        setDialogGame(null);
        setOpenDeleteDialog(false);
    };

    const deleteGame = () => {
        axios.delete(`http://localhost:4941/api/v1/games/${id}`)
            .then(() => {
                navigate("/games");
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
            .finally(() => {
                    handleDeleteDialogClose();
            });
    };

    React.useEffect(() => {
        getGame();
    }, [id]);

    return (
        <div>
            <h1>Game</h1>
            {errorFlag && <div style={{ color: "red" }}>{errorMessage}</div>}

            <p>
                <strong>Title:</strong> {game.title} <br />
                <strong>Rating:</strong> {game.rating} <br />
                <strong>Price:</strong> ${game.price}
            </p>

            <Link to="/games">Back to games</Link>
            &nbsp;&nbsp;
            <Button variant="contained" color="primary">Edit</Button>
            &nbsp;&nbsp;
            <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)}>
                Delete
            </Button>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Game?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete <strong>{game.title}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={deleteGame} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Game;
