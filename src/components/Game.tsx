import axios from "axios";
import React from "react";
import {Box, Button, Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {HashLink} from 'react-router-hash-link';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import CSS from "csstype";
import fallbackAvatar from "../assets/fallback-avatar.png"
import {useGameStore} from "../store";
import GameListObject from "./GameListObject";
import fallbackGameLogo from "../assets/fallback-game-logo.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReviewForm from "./ReviewForm";
import WishlistAndLibraryButtons from "./WishlistAndLibraryButtons";


const Game = () => {
    const {id} = useParams();
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
        title: "",
        description: "",
        platformIds: [],
        numberOfWishlists: 0,
        numberOfOwners: 0,
    })

    type Review = {
        reviewerId: number;
        reviewerFirstName: string;
        reviewerLastName: string;
        rating: number;
        review: string | null;
        timestamp: string;
    };

    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [reviewerImages, setReviewerImages] = React.useState<Record<number, string>>({});

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);

    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [genreSearch, setGenreSearch] = React.useState<number | null>(null);
    const [creatorSearch, setCreatorSearch] = React.useState<number | null>(null);

    const games = useGameStore(state => state.games);
    const setGames = useGameStore(state => state.setGames);

    const [ownedGames, setOwnedGames] = React.useState<Game[]>([]);

    const location = useLocation();


    React.useEffect(() => {
        const getOwnedGames = () => {
            const token = localStorage.getItem("token");
            axios.get(`http://localhost:4941/api/v1/games?ownedByMe=true`, {
                headers: {
                    "X-Authorization": token,
                },
            })
                .then((response) => {
                    setOwnedGames(response.data.games);
                }, (error) => {
                    console.log(error)
                });
        };
        getOwnedGames();
    }, [setOwnedGames]);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const getGame = () => {
        axios.get(`http://localhost:4941/api/v1/games/${id}`)
            .then((response) => {
                setGame(response.data);
                setErrorFlag(false);
                setErrorMessage("");
                setGenreSearch(response.data.genreId);
                setCreatorSearch(response.data.creatorId);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const getGames = () => {
        if (genreSearch === null || creatorSearch === null) return;

        const genreParams = new URLSearchParams();
        genreParams.append("genreIds", genreSearch.toString());

        const creatorParams = new URLSearchParams();
        creatorParams.append("creatorId", creatorSearch.toString());

        const genreGamesRequest = axios.get(`http://localhost:4941/api/v1/games?${genreParams.toString()}`);
        const creatorGamesRequest = axios.get(`http://localhost:4941/api/v1/games?${creatorParams.toString()}`);

        Promise.all([genreGamesRequest, creatorGamesRequest])
            .then(([genreRes, creatorRes]) => {
                const allGames = [...genreRes.data.games, ...creatorRes.data.games];
                const uniqueGames = Array.from(
                    new Map(allGames.map(g => [g.gameId, g])).values()
                ).filter((g) => g.gameId !== game.gameId);

                setGames(uniqueGames);
                setErrorFlag(false);
                setErrorMessage("");
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };


    React.useEffect(() => {
        getGame();
        getGameGenres();
        getGamePlatforms();
    }, [id]);

    React.useEffect(() => {
        if (genreSearch !== null && creatorSearch !== null) {
            getGames();
        }
    }, [genreSearch, creatorSearch, game.gameId]);


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
                    setUserImageUrl(fallbackAvatar);
                }
            });
    }, [game.gameId]);


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


    const getGameReviews = (gameId: number) => {
        axios
            .get(`http://localhost:4941/api/v1/games/${gameId}/reviews`)
            .then((response) => {
                setReviews(response.data);
                fetchReviewerImages(response.data);
            })
            .catch((error) => {
                showSnackbar("Error getting game reviews: " + error.toString(), "error");
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };


    const fetchReviewerImages = (reviews: Review[]) => {
        reviews.forEach((r) => {
            axios
                .get(`http://localhost:4941/api/v1/users/${r.reviewerId}/image`, {responseType: "blob"})
                .then((res) => {
                    const imageUrl = URL.createObjectURL(res.data);
                    setReviewerImages((prev) => ({...prev, [r.reviewerId]: imageUrl}));
                })
                .catch((err) => {
                    setReviewerImages((prev) => ({...prev, [r.reviewerId]: fallbackAvatar}));
                });
        });
    };


    React.useEffect(() => {
        if (game.gameId !== 0) {
            getGameReviews(game.gameId);
        }
    }, [game.gameId]);


    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        margin: "10px",
        padding: "0px",
    }

    return (
        <div>
            {errorFlag && <div style={{color: "red"}}>{errorMessage}</div>}
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                            const scrollY = location.state?.scrollY || 0;
                            navigate("/home", { state: { scrollY } });
                        }}
                        startIcon={<ArrowBackIcon />}
                    >
                    Back to Games
                    </Button>
                </Box>

                <Card sx={{...gameCardStyles}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <CardMedia
                            component="img"
                            sx={{
                                width: 600,
                                height: 600,
                                objectFit: "cover",
                            }}
                            image={imageUrl || fallbackGameLogo}
                            alt="Game cover"
                        />
                        <CardContent
                            sx={{
                                flex: 1,
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                {game.title} - {game.rating} ★
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                {game.price === 0.00 ? "FREE" : "$" + (game.price / 100).toFixed(2)}
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

                            <Typography variant="body2" color="inherit" noWrap>
                                &nbsp;
                            </Typography>

                            <Typography variant="body2" color="textPrimary">
                                {game.description}
                            </Typography>

                            <Typography variant="body2" color="inherit" noWrap>
                                &nbsp;
                            </Typography>

                            <Typography variant="body2">
                                <HashLink smooth to="#all-reviews" style={{textDecoration: 'none'}}>
                                    All Reviews
                                </HashLink>
                            </Typography>

                            <Typography variant="body2" color="inherit" noWrap>
                                &nbsp;
                            </Typography>

                            <WishlistAndLibraryButtons
                                gameId={game.gameId}
                                creatorId={game.creatorId}
                                isOwned={ownedGames.some(g => g.gameId === game.gameId)}
                            />

                            <Typography variant="body2" color="inherit" noWrap>
                                &nbsp;
                            </Typography>

                            <Typography variant="body2" color="inherit" noWrap>
                                &nbsp;
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

                <Card sx={{...gameCardStyles}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <CardContent
                            sx={{
                                flex: 1,
                            }}
                        >
                            <Typography variant="h6">
                                Similar games you might like
                            </Typography>
                            {games.length === 0 && (
                                <Typography variant="body2" color="textSecondary">
                                    No similar games found
                                </Typography>
                            )}
                            <Grid container spacing={3} justifyContent="center">
                                {games.map((game: Game) => (
                                    <Grid key={game.gameId}>
                                        <GameListObject game={game}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Box>
                </Card>

                <Card sx={{...gameCardStyles}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <CardContent
                            sx={{
                                flex: 1,
                            }}
                        >
                            <ReviewForm
                                gameId={game.gameId}
                                gameTitle={game.title}
                                creatorId={game.creatorId}
                                currentUser={{
                                    id: Number(localStorage.getItem("userId")),
                                    isAuthenticated: !!localStorage.getItem("token")
                                }}
                                onReviewSubmitted={() => getGameReviews(game.gameId)}
                            />

                            <Typography variant="body2" color="inherit" noWrap>
                                &nbsp;
                            </Typography>

                            <Typography variant="h6" id="all-reviews">
                                Reviews ({reviews.length})
                            </Typography>
                            {reviews.length === 0 && (
                                <Typography variant="body2" color="textSecondary">
                                    No reviews yet.
                                </Typography>
                            )}

                            {reviews.map((review, idx) => (
                                <Box key={idx} sx={{
                                    borderBottom: "1px solid #ddd",
                                    padding: "10px 0",
                                    display: 'flex',
                                    alignItems: 'flex-start'
                                }}>
                                    <img
                                        src={reviewerImages[review.reviewerId] || fallbackAvatar}
                                        alt="Reviewer"
                                        width={60}
                                        height={60}
                                        style={{borderRadius: "50%", marginRight: 10}}
                                    />
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {review.reviewerFirstName} {review.reviewerLastName} - {review.rating}★
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(review.timestamp).toLocaleString("en-NZ", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </Typography>
                                        {review.review && (
                                            <Typography variant="body2" sx={{marginTop: 0.5}}>
                                                {review.review}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Box>
                </Card>
            </Box>
        </div>
    );
};

export default Game;
