import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useGameStore} from "../store";
import {
    Alert, Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Snackbar, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';

interface IGameProps {
    game: Game
}


const GameListObject = (props: IGameProps) => {
    const [game] = React.useState<Game>(props.game)

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const deleteGameFromStore = useGameStore(state => state.removeGame)

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

    React.useEffect(() => {
        axios
            .get(`http://localhost:4941/api/v1/games/${game.gameId}/image`, {
                responseType: 'blob'
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("Error fetching image", error);
                setImageUrl("https://via.placeholder.com/200x200?text=No+Image");
            });
    }, [game.gameId]);

    const handleDeleteDialogOpen = (game: Game) => {
        setDialogGame(game);
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setDialogGame(null);
        setOpenDeleteDialog(false);
    };

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const deleteGame = (gameId: number) => {
        axios
            .delete(`http://localhost:4941/api/v1/games/${gameId}`)
            .then(() => {
                deleteGameFromStore(game)
                showSnackbar("Game deleted successfully", "success");
            })
            .catch((error) => {
                showSnackbar("Error deleting game: " + error.toString(), "error");
            })
            .finally(() => {
                handleDeleteDialogClose();
            });
    };

    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }
    return (
        <Card sx={gameCardStyles}>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{objectFit:"cover"}}
                image={imageUrl || "https://via.placeholder.com/200x200?text=Loading..."}
                alt="Auction hero"
            />
        <CardContent>
            <Typography variant="h4">
                {game.gameId} {game.title}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton onClick={() => handleDeleteDialogOpen(game)}>
                <Delete/>
            </IconButton>
        </CardActions>

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
    </Card>
    )
}
export default GameListObject