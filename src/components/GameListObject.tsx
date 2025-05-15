import React from "react";
import axios from "axios";
import {Delete} from "@mui/icons-material";
import {useGameStore} from "../store";
// import dayjs from "dayjs";
import {
    Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Snackbar, Typography
} from "@mui/material";
import CSS from 'csstype';
import {useNavigate} from "react-router-dom";

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

    const navigate = useNavigate();

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
        height: "400px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }
    return (
        <Card sx={{
            ...gameCardStyles,
            cursor: 'pointer',
            '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
            transition: 'all 0.2s ease-in-out'
        }}>
            <Box onClick={() => navigate(`/games/${game.gameId}`)}>
                <CardMedia
                    component="img"
                    height="200"
                    width="200"
                    sx={{ objectFit: "cover" }}
                    image={imageUrl || "https://via.placeholder.com/200x200?text=Loading..."}
                    alt="Game hero"
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {game.title}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        {/* Created: {dayjs(game.creationDate).format("D MMM YYYY, h:mm A")} */}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        Genre: {game.genreId}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        Price: ${game.price?.toFixed(2)}
                    </Typography>

                    {/*<Typography variant="body2" color="textSecondary">*/}
                    {/*    Platforms: {game.platformIds?.join(", ")}*/}
                    {/*</Typography>*/}

                    <Box display="flex" alignItems="center" mt={1}>
                        <img
                            src={imageUrl || "https://via.placeholder.com/40x40?text=User"}
                            alt="Creator"
                            width={40}
                            height={40}
                            style={{ borderRadius: "50%", marginRight: 8 }}
                        />
                        <Typography variant="body2">
                            {game.creatorFirstName} {game.creatorLastName}
                        </Typography>
                    </Box>
                </CardContent>
            </Box>

            <CardActions>
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDialogOpen(game);
                }}>
                    <Delete />
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