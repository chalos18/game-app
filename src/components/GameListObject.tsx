import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useGameStore} from "../store";
import {Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, TextField, Typography} from "@mui/material";
import CSS from 'csstype';

interface IGameProps {
    game: Game
}


const GameListObject = (props: IGameProps) => {
    const [game] = React.useState<Game>(props.game)
    const [games, setGames] = React.useState<Game[]>([]);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // const [title, setTitle] = React.useState("")

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const deleteGameFromStore = useGameStore(state => state.removeGame)

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    // const editGameFromStore = useGameStore(state => state.editGame)

    React.useEffect(() => {
        axios
            .get(`http://localhost:4941/api/v1/games/${game.gameId}/image`, {
                responseType: 'blob' // Important: treat it as binary data
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("Error fetching image", error);
                // fallback image if needed
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

    // const getGameCoverImage = (gameId: number) => {
    //     axios
    //         .get(`http://localhost:4941/api/v1/games/${gameId}/image`)
    //         .then((response) => {
    //             console.log(response.data);
    //             setGameImage(response.data.image);
    //         })
    //         .catch((error) => {
    //             showSnackbar("Error getting cover image: " + error.toString(), "error");
    //         })
    //         .catch((error) => {
    //             setErrorFlag(true);
    //             setErrorMessage(error.toString());
    //         });
    // }


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
            {/*<IconButton onClick={() => {setOpenEditDialog(true)}}>*/}
            {/*    <Edit/>*/}
            {/*</IconButton>*/}
            <IconButton onClick={() => handleDeleteDialogOpen(game)}>
                <Delete/>
            </IconButton>
        </CardActions>

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