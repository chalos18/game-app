import React, {useState} from "react";
import axios from "axios";
// import dayjs from "dayjs";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import {useNavigate} from "react-router-dom";
import fallbackAvatar from "../assets/fallback-avatar.png";
import fallbackGameLogo from "../assets/fallback-game-logo.png";
import {useGameStore} from "../store";
import EditIcon from "@mui/icons-material/Edit";
import GameEditForm from "./GameEditForm";

interface IGameProps {
    game: Game,
    showEditButtons?: boolean,
}

const GameListObject = (props: IGameProps) => {
    const [game, setGame] = React.useState<Game>(props.game)

    const editGameFromStore = useGameStore(state => state.editGame)

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);
    const [imgError, setImgError] = useState(false)

    const navigate = useNavigate();

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [gameDescription, setGameDescription] = React.useState("");

    // const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const [newTitle, setNewTitle] = React.useState("");
    const [newDescription, setNewDescription] = React.useState("");
    const [newGenreId, setNewGenreId] = React.useState<number | "">("");
    const [newPrice, setNewPrice] = React.useState<number | "">("");
    const [newPlatformIds, setNewPlatformIds] = React.useState<number[]>([]);

    const [openEditDialog, setOpenEditDialog] = React.useState(false)

    const parseValidationError = (message: string): { [key: string]: string } => {
        const rules: { [key: string]: [string, string] } = {
            "data/genreId must be >= 0": ["genreId", "Genre ID must be non-negative"],
            "No genre with id": ["genreId", "Genre ID must reference an existing genre"],
            "data/platformIds must be array": ["platformIds", "Platform IDs must be comma-separated"],
            "data/price must be integer": ["price", "Price must be a number"],
            "data/price must be >= 0": ["price", "Price must be non-negative"],
            "Duplicate petition": ["title", "Game already exists"],
            "No platform with id": ["platformIds", "Platform ID must reference an existing platform"],
            "data/platformIds must NOT have fewer than 1 items": ["platformIds", "Game must have at least one Platform"],
        };

        const result: { [key: string]: string } = {};

        const parts = message.split(/[,;]+/).map(part => part.trim());

        for (const part of parts) {
            for (const key in rules) {
                if (part.includes(key)) {
                    const [field, text] = rules[key];
                    result[field] = text;
                }
            }
        }

        return result;
    };

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    // const deleteGameFromStore = useGameStore(state => state.removeGame)
    //
    // const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)


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


    // const handleDeleteDialogOpen = (game: Game) => {
    //     setDialogGame(game);
    //     setOpenDeleteDialog(true);
    // };
    //
    // const handleDeleteDialogClose = () => {
    //     setDialogGame(null);
    //     setOpenDeleteDialog(false);
    // };
    //
    //
    // const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === "clickaway") return;
    //     setSnackOpen(false);
    // };

    // const deleteGame = (gameId: number) => {
    //     axios
    //         .delete(`http://localhost:4941/api/v1/games/${gameId}`)
    //         .then(() => {
    //             deleteGameFromStore(game)
    //             showSnackbar("Game deleted successfully", "success");
    //         })
    //         .catch((error) => {
    //             showSnackbar("Error deleting game: " + error.toString(), "error");
    //         })
    //         .finally(() => {
    //             handleDeleteDialogClose();
    //         });
    // };
    //

    const getGameGenres = () => {
        axios
            .get(`http://localhost:4941/api/v1/games/genres`)
            .then((response) => {
                setGenres(response.data);
            })
            .catch((error) => {
                showSnackbar("Error getting game genres: " + error.toString(), "error");
                setErrorFlag(true);
                setErrorMessage(error.toString());
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
                setErrorFlag(true);
                setErrorMessage(error.toString());
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
            setFieldErrors(errors);
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

                setNewTitle("");
                setNewDescription("");
                setNewGenreId("");
                setNewPrice("");
                setNewPlatformIds([]);
                setFieldErrors({});
            })
    }

    const getGame = () => {
        axios.get(`http://localhost:4941/api/v1/games/${game.gameId}`)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                game.description = response.data.description;
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
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

            <Box onClick={() => navigate(`/games/${game.gameId}`)}>
                <CardMedia
                    component="img"
                    height="300"
                    width="200"
                    sx={{objectFit: "cover", color: "black"}}
                    image={imageUrl || fallbackGameLogo}
                    alt="Game hero"
                    onError={() => setImgError(true)}
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
                            {game.price === 0.00 ? "FREE" : "$" + game.price?.toFixed(2)}
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
                                    endIcon={<EditIcon/>}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenEditDialog((prev) => !prev);
                                    }}
                                >
                                    {openEditDialog ? "Cancel" : "Edit"}
                                </Button>

                            )}
                        </CardActions>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    )
}
export default GameListObject