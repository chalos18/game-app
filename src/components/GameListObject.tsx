import React from "react";
import axios from "axios";
// import dayjs from "dayjs";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import {useNavigate} from "react-router-dom";
import fallbackAvatar from "../assets/fallback-avatar.png";
import fallbackGameLogo from "../assets/fallback-game-logo.png";
import {useGameStore} from "../store";
import EditIcon from "@mui/icons-material/Edit";
import GameEditForm from "./GameEditForm";
import DeleteIcon from "@mui/icons-material/Delete";

interface IGameProps {
    game: Game,
    showEditButtons?: boolean,
}

const GameListObject = (props: IGameProps) => {
    const [game, setGame] = React.useState<Game>(props.game)

    const editGameFromStore = useGameStore(state => state.editGame)

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);

    const navigate = useNavigate();

    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [openEditDialog, setOpenEditDialog] = React.useState(false)

    const deleteGameFromStore = useGameStore(state => state.removeGame)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };


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
                setImageUrl(fallbackGameLogo);
            });
    }, [game.gameId]);

    React.useEffect(() => {
        axios
            .get(`http://localhost:4941/api/v1/users/${game.creatorId}/image`, {
                responseType: 'blob'
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setUserImageUrl(url);
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    setUserImageUrl(null);
                } else {
                    setUserImageUrl(fallbackGameLogo);
                }
            });
    }, [game.gameId]);


    const deleteGame = (gameId: number) => {
        const token = localStorage.getItem("token");
        axios.delete(`http://localhost:4941/api/v1/games/${gameId}`, {
            headers: {
                "X-Authorization": token,
            },
        })
            .then(() => {
                deleteGameFromStore(game);
                showSnackbar("Game deleted successfully", "success");
            })
            .catch((error) => {
                showSnackbar("Error deleting game: " + error.toString(), "error");
            })
            .finally(() => {
                handleDeleteDialogClose();
            });
    };


    const getGameGenres = () => {
        axios
            .get(`http://localhost:4941/api/v1/games/genres`)
            .then((response) => {
                setGenres(response.data);
            })
            .catch((error) => {
                showSnackbar("Error getting game genres: " + error.toString(), "error");
            });
    };

    const getGamePlatforms = () => {
        axios
            .get(`http://localhost:4941/api/v1/games/platforms`)
            .then((response) => {
                setPlatforms(response.data);
            })
            .catch((error) => {
                showSnackbar("Error getting game platforms: " + error.toString(), "error");
            });
    };

    React.useEffect(() => {
        getGameGenres();
        getGamePlatforms();
        getGame();
    }, []);

    const getGenreNameById = (id: number) => {
        const genre = genres.find((g) => g.genreId === id);
        return genre ? genre.name : "Unknown";
    };

    const getPlatformNamesByIds = (ids: number[]): string => {
        const names = ids
            .map(id => platforms.find(p => p.platformId === id)?.name)
            .filter((name): name is string => !!name);
        return names.length > 0 ? names.join(", ") : "Unknown";
    };

    const updateGame = (
        newTitle: string,
        newDescription: string,
        newGenreId: number | "",
        newPrice: number | "",
        newPlatformIds: number[]
    ) => {
        const errors: { [key: string]: string } = {};

        if (!newTitle.trim()) errors.title = "Title is required";
        if (!newDescription.trim()) errors.description = "Description is required";
        if (newGenreId === "") errors.genreId = "Genre is required";
        if (newPrice === "") errors.price = "Price is required";
        if (newPlatformIds.length === 0) errors.platformIds = "One or more platforms required";

        if (Object.keys(errors).length > 0) {
            showSnackbar("Please fix the highlighted fields", "warning");
            return;
        }
        const token = localStorage.getItem("token");
        axios
            .patch(`http://localhost:4941/api/v1/games/${game.gameId}`, {
                title: newTitle,
                description: newDescription,
                genreId: Number(newGenreId),
                price: Number(newPrice),
                platformIds: newPlatformIds,
            }, {
                headers: {
                    "X-Authorization": token,
                },
            })
            .then(() => {
                const updatedGame = {
                    ...game,
                    title: newTitle,
                    description: newDescription,
                    genreId: Number(newGenreId),
                    price: Number(newPrice),
                    platformIds: newPlatformIds,
                };
                setGame(updatedGame);

                editGameFromStore(game, newTitle, newDescription, newGenreId, newPrice, newPlatformIds);
                showSnackbar("Game updated successfully", "success");
            })
    }

    const getGame = () => {
        axios.get(`http://localhost:4941/api/v1/games/${game.gameId}`)
            .then((response) => {
                game.description = response.data.description;
            })
            .catch((error) => {
                showSnackbar("Error getting game: " + error.toString(), "error");
            });
    }


    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        width: "300px",
        height: "500px",
        margin: "10px",
        padding: "0px"
    }
    return (
        <>
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
            <Card sx={{
                ...gameCardStyles,
                cursor: 'pointer',
                '&:hover': {boxShadow: 6, transform: 'scale(1.02)'},
                transition: 'all 0.2s ease-in-out',
            }}>

                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Edit Game</DialogTitle>
                    <DialogContent>
                        <GameEditForm
                            game={game}
                            genres={genres}
                            platforms={platforms}
                            onUpdate={({newTitle, newDescription, newGenreId, newPrice, newPlatformIds}) => {
                                updateGame(newTitle, newDescription, newGenreId, newPrice, newPlatformIds);
                                setOpenEditDialog(false);
                            }}
                            onCancel={() => handleEditDialogClose()}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Game?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this game?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            deleteGame(game.gameId)
                        }} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box onClick={() => navigate(`/games/${game.gameId}`)}>
                    <CardMedia
                        component="img"
                        height="300"
                        width="200"
                        sx={{objectFit: "cover", color: "black"}}
                        image={imageUrl || fallbackGameLogo}
                        alt="Game hero"
                    />
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "calc(500px - 300px)",
                            overflowY: openEditDialog ? "auto" : "hidden"
                        }}
                    >
                        <Box>
                            <Typography variant="h6" gutterBottom noWrap>
                                {game.title}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                {game.price === 0.00 ? "FREE" : "$" + (game.price / 100).toFixed(2)}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" noWrap>
                                {getGenreNameById(game.genreId)}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {getPlatformNamesByIds(game.platformIds)}
                            </Typography>
                        </Box>

                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                                Created {new Date(game.creationDate).toLocaleString("en-NZ", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mt={1}>
                            <img
                                src={userImageUrl || fallbackAvatar}
                                alt="Creator"
                                width={40}
                                height={40}
                                style={{borderRadius: "50%", marginRight: 8}}
                            />
                            <Typography variant="body2" noWrap>
                                {game.creatorFirstName} {game.creatorLastName}
                            </Typography>

                            <CardActions>
                                {props.showEditButtons && (
                                    <Button
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenEditDialog((prev) => !prev);
                                        }}
                                    >
                                        {openEditDialog ? "Cancel" : <EditIcon/>}
                                    </Button>

                                )}

                                {props.showEditButtons && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                const response = await axios.get(`http://localhost:4941/api/v1/games/${game.gameId}/reviews`);
                                                const reviews = response.data;
                                                if (reviews.length > 0) {
                                                    showSnackbar("Can not delete a game that has one or more reviews", "error");
                                                    handleDeleteDialogClose();
                                                } else {
                                                    deleteGame(game.gameId);
                                                }
                                            } catch (error) {
                                                showSnackbar("Failed to check reviews", "error");
                                                handleDeleteDialogClose();
                                            }
                                        }}
                                        autoFocus
                                    >
                                        <DeleteIcon/>
                                    </Button>
                                )}
                            </CardActions>
                        </Box>
                    </CardContent>
                </Box>
            </Card>
        </>
    )
}
export default GameListObject