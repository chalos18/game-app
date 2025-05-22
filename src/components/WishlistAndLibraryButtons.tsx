import React, {useEffect, useState} from "react";
import {Alert, Button, Snackbar, Typography} from "@mui/material";
import axios from "axios";
import {useParams} from "react-router-dom";

interface WishlistButtonProps {
    gameId: number;
    creatorId: number;
    isOwned: boolean;
}

const WishlistAndLibraryButtons: React.FC<WishlistButtonProps> = ({gameId, creatorId, isOwned}) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasWishlisted, setHasWishlisted] = useState(false);
    const [hasOwned, setHasOwned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [justUpdatedWishlist, setJustUpdatedWishlist] = useState(false);

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
    const {id} = useParams();

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    React.useEffect(() => {
        getGame();
    }, [id]);

    const getGame = () => {
        axios.get(`http://localhost:4941/api/v1/games/${id}`)
            .then((response) => {
                setGame(response.data);
            })
            .catch((error) => {
            });
    }

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");
        setUserId(storedUserId ? Number(storedUserId) : null);
        setToken(storedToken);
        setIsAuthenticated(!!storedToken);

        const wishlist = localStorage.getItem("wishlistGames");
        const owned = localStorage.getItem("ownedGames");

        if (wishlist) {
            try {
                const wishlistIds: number[] = JSON.parse(wishlist);
                setHasWishlisted(wishlistIds.includes(gameId));
            } catch (e) {
                console.error("Error parsing wishlistGames", e);
            }
        }

        if (owned) {
            try {
                const ownedIds: number[] = JSON.parse(owned);
                setHasOwned(ownedIds.includes(gameId));
            } catch (e) {
                console.error("Error parsing ownedGames", e);
            }
        }
    }, [gameId]);

    useEffect(() => {
        if (!userId || !token || hasOwned) return;

        axios.get(`http://localhost:4941/api/v1/games?ownedByMe=true`, {
            headers: {"X-Authorization": token}
        })
            .then(res => {
                const owned = res.data.some((g: any) => g.gameId === gameId);
                setHasOwned(owned);
            })
            .catch(err => {
                console.error("Error fetching owned games", err);
            });
    }, [userId, token, gameId]);


    useEffect(() => {
        const handleStorageChange = () => {
            const storedWishlist = localStorage.getItem("wishlistGames");
            if (storedWishlist) {
                try {
                    const wishlistGames: number[] = JSON.parse(storedWishlist);
                    setHasWishlisted(wishlistGames.includes(gameId));
                } catch (e) {
                    console.error("Error parsing wishlistGames from localStorage", e);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [gameId]);


    const handleWishlist = () => {
        if (!isAuthenticated) {
            showSnackbar("Log in to wishlist this game", "error");
            return;
        }
        if (userId === creatorId) {
            showSnackbar("You can not wishlist your own game", "error");
            return;
        }
        if (isOwned) {
            showSnackbar("Game is already owned", "error");
            return;
        }

        setLoading(true);

        axios.post(`http://localhost:4941/api/v1/games/${gameId}/wishlist`, {}, {
            headers: {
                "X-Authorization": token ?? "",
            }
        })
            .then(() => {
                showSnackbar("Item added to your wishlist!", "success");
                setHasWishlisted(true);
                setJustUpdatedWishlist(true);
                setShowPopup(true);
                getGame();

                const storedWishlist = localStorage.getItem("wishlistGames");
                let wishlistGames: number[] = [];
                if (storedWishlist) {
                    try {
                        wishlistGames = JSON.parse(storedWishlist);
                    } catch {
                        wishlistGames = [];
                    }
                }
                if (!wishlistGames.includes(gameId)) {
                    wishlistGames.push(gameId);
                    localStorage.setItem("wishlistGames", JSON.stringify(wishlistGames));
                }
            })
            .catch((error) => {
                const backendMessage = error.response.statusText;
                console.error(backendMessage, error);
                if (backendMessage.includes("Cannot wishlist a game that is already marked as owned")) {
                    showSnackbar("Can not wishlist a game that is already in the library", "error");
                } else {
                    showSnackbar("Error adding game to wishlist", "error");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleWishlistRemoval = () => {
        if (!isAuthenticated) {
            showSnackbar("Log in to remove from wishlist", "error");
            return;
        }
        if (userId === creatorId) {
            showSnackbar("You can not wishlist your own game", "error");
            return;
        }
        if (isOwned) {
            showSnackbar("Game is already owned", "error");
            return;
        }

        setLoading(true);

        getGame();

        axios.delete(`http://localhost:4941/api/v1/games/${gameId}/wishlist`, {
            headers: {
                "X-Authorization": token ?? "",
            }
        })
            .then(() => {
                setHasWishlisted(false);
                setJustUpdatedWishlist(true);
                setShowPopup(true);
                getGame();
                showSnackbar("Item removed from your wishlist!", "success");

                const storedWishlist = localStorage.getItem("wishlistGames");
                let wishlistGames: number[] = [];
                if (storedWishlist) {
                    try {
                        wishlistGames = JSON.parse(storedWishlist);
                    } catch {
                        wishlistGames = [];
                    }
                }

                const updatedWishlist = wishlistGames.filter(id => id !== gameId);
                localStorage.setItem("wishlistGames", JSON.stringify(updatedWishlist));
            })
            .catch((error) => {
                const backendMessage = error.response.statusText;
                console.error(backendMessage, error);
                if (backendMessage.includes("Cannot wishlist a game that is already marked as owned")) {
                    showSnackbar("Can not wishlist a game that is already in the library", "error");
                } else {
                    showSnackbar("Error removing from wishlist", "error");

                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleOwningGame = () => {
        if (!isAuthenticated) {
            showSnackbar("Log in to get this game", "error");
            return;
        }
        if (userId === creatorId) {
            showSnackbar("You can not get your own game", "error");
            return;
        }
        if (isOwned) {
            showSnackbar("Game is already owned", "error");
            return;
        }


        setLoading(true);

        axios.post(`http://localhost:4941/api/v1/games/${gameId}/owned`, {}, {
            headers: {
                "X-Authorization": token ?? "",
            }
        })
            .then(() => {
                showSnackbar("Game added to your owned games!", "success");
                setHasOwned(true);
                setHasWishlisted(false); // <-- Make sure UI reflects removal from wishlist
                setJustUpdatedWishlist(true); // <-- Trigger effect to update state
                setShowPopup(true);
                getGame();

                const storeOwnedGames = localStorage.getItem("ownedGames");
                let ownedGames: number[] = [];
                if (storeOwnedGames) {
                    try {
                        ownedGames = JSON.parse(storeOwnedGames);
                    } catch {
                        ownedGames = [];
                    }
                }
                if (!ownedGames.includes(gameId)) {
                    ownedGames.push(gameId);
                    localStorage.setItem("ownedGames", JSON.stringify(ownedGames));
                }

                const storedWishlist = localStorage.getItem("wishlistGames");
                if (storedWishlist) {
                    try {
                        const wishlistGames: number[] = JSON.parse(storedWishlist);
                        const updatedWishlist = wishlistGames.filter(id => id !== gameId);
                        localStorage.setItem("wishlistGames", JSON.stringify(updatedWishlist));
                    } catch (e) {
                        console.error("Error updating wishlist in localStorage", e);
                    }
                }
            })
            .catch((error) => {
                console.error("Error owning game", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleOwningGameRemoval = () => {
        if (!isAuthenticated) {
            showSnackbar("Log in to remove from library", "error");
            return;
        }
        if (userId === creatorId) {
            showSnackbar("You can not get your own game", "error");
            return;
        }

        setLoading(true);

        axios.delete(`http://localhost:4941/api/v1/games/${gameId}/owned`, {
            headers: {
                "X-Authorization": token ?? "",
            }
        })
            .then(() => {
                setHasOwned(false);
                setShowPopup(true);

                const storedWishlist = localStorage.getItem("wishlistGames");
                if (storedWishlist) {
                    try {
                        const wishlistGames: number[] = JSON.parse(storedWishlist);
                        if (wishlistGames.includes(gameId)) {
                            handleWishlistRemoval();
                        }
                    } catch (e) {
                        console.error("Error parsing wishlistGames during ownership removal", e);
                    }
                }

                getGame();
                showSnackbar("Item removed from your library!", "success");

                const storeOwnedGames = localStorage.getItem("ownedGames");
                let ownedGames: number[] = [];
                if (storeOwnedGames) {
                    try {
                        ownedGames = JSON.parse(storeOwnedGames);
                    } catch {
                        ownedGames = [];
                    }
                }

                const updatedLibrary = ownedGames.filter(id => id !== gameId);
                localStorage.setItem("ownedGames", JSON.stringify(updatedLibrary));
            })
            .catch((error) => {
                const backendMessage = error.response.statusText;
                console.error(backendMessage, error);
                if (backendMessage.includes("Cannot wishlist a game that is already marked as owned")) {
                    showSnackbar("Can not wishlist a game that is already in the library", "error");
                } else {
                    showSnackbar("Error removing game from library", "error");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };


    if (userId === creatorId) {
        return null;
    }

    return (
        <div style={{marginTop: 8}}>
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

            <Typography variant="body2" color="textSecondary">
                Currently in {game.numberOfWishlists} wishlist(s)
            </Typography>

            <Typography variant="body2" color="inherit" noWrap>
                &nbsp;
            </Typography>

            {hasWishlisted ? (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleWishlistRemoval}
                    disabled={loading}
                >
                    Remove from Wishlist
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleWishlist}
                    disabled={loading}
                >
                    Add to your wishlist
                </Button>
            )}

            <Typography variant="body2" color="inherit" noWrap>
                &nbsp;
            </Typography>

            <Typography variant="body2" color="textSecondary">
                Currently {game.numberOfOwners} user(s) own the game
            </Typography>

            <Typography variant="body2" color="inherit" noWrap>
                &nbsp;
            </Typography>

            {hasOwned ? (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOwningGameRemoval}
                    disabled={loading}
                >
                    Remove from Library
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOwningGame}
                    disabled={loading}
                >
                    Get Game
                </Button>
            )}

        </div>
    );
};

export default WishlistAndLibraryButtons;
