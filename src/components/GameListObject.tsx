import React, {useState} from "react";
import axios from "axios";
// import dayjs from "dayjs";
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import CSS from 'csstype';
import {useNavigate} from "react-router-dom";
import fallbackAvatar from "../assets/fallback-avatar.png";
import fallbackGameLogo from "../assets/fallback-game-logo.png";

interface IGameProps {
    game: Game
}

const GameListObject = (props: IGameProps) => {
    const [game] = React.useState<Game>(props.game)

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);
    const [imgError, setImgError] = useState(false)

    const navigate = useNavigate();

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // const [dialogGame, setDialogGame] = React.useState<Game | null>(null);

    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
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


    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }
    return (
        <Card sx={{
            ...gameCardStyles,
            cursor: 'pointer',
            '&:hover': {boxShadow: 6, transform: 'scale(1.02)'},
            transition: 'all 0.2s ease-in-out',
            // backgroundColor: "#406262",
            // color: "white",
        }}>
            <Box onClick={() => navigate(`/games/${game.gameId}`)}>
                <CardMedia
                    component="img"
                    // height="300"
                    width="200"
                    sx={{objectFit: "cover", color: "black"}}
                    image={imageUrl || fallbackGameLogo}
                    alt="Game hero"
                    onError={() => setImgError(true)}
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {game.title}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        {game.price === 0.00 ? "FREE" : "$" + game.price?.toFixed(2)}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        {getGenreNameById(game.genreId)}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        {getPlatformNamesByIds(game.platformIds)}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        Created {new Date(game.creationDate).toLocaleString("en-NZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                    </Typography>

                    <Box display="flex" alignItems="center" mt={1}>
                        <img
                            src={userImageUrl || fallbackAvatar}
                            alt="Creator"
                            width={50}
                            height={50}
                            style={{borderRadius: "50%", marginRight: 8}}
                        />
                        <Typography variant="body2">
                            {game.creatorFirstName} {game.creatorLastName}
                        </Typography>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    )
}
export default GameListObject