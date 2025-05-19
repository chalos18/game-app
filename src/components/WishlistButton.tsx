import React, { useState, useEffect } from "react";
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useGameStore} from "../store";

interface WishlistButtonProps {
    gameId: number;
    creatorId: number;
    isOwned: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ gameId, creatorId, isOwned }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasWishlisted, setHasWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");
        setUserId(storedUserId ? Number(storedUserId) : null);
        setToken(storedToken);
        setIsAuthenticated(!!storedToken);
    }, []);

    useEffect(() => {
        if (!userId || !token) return; // wait for both to be set

        axios.get(`http://localhost:4941/api/v1/games?wishlistedByMe=true`, {
            headers: { "X-Authorization": token }
        })
            .then(res => {
                const wished = res.data.some((g: any) => g.gameId === gameId);
                setHasWishlisted(wished);
            })
            .catch(err => {
                console.error("Error fetching wishlist", err);
            });
    }, [userId, token, gameId]);


    useEffect(() => {
        // On mount, load wishlist from localStorage
        const storedWishlist = localStorage.getItem("wishlistGames");
        if (storedWishlist) {
            try {
                const wishlistGames: number[] = JSON.parse(storedWishlist);
                setHasWishlisted(wishlistGames.includes(gameId));
            } catch (e) {
                console.error("Error parsing wishlistGames from localStorage", e);
            }
        }
    }, [gameId]);

    const handleWishlist = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (userId === creatorId) {
            alert("You cannot wishlist your own game.");
            return;
        }
        if (isOwned) {
            alert("You already own this game.");
            return;
        }

        setLoading(true);

        axios.post(`http://localhost:4941/api/v1/games/${gameId}/wishlist`, {}, {
            headers: {
                "X-Authorization": token ?? "",
            }
        })
            .then(() => {
                setHasWishlisted(true);
                setShowPopup(true);

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
                console.error("Error wishlisting game", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    if (userId === creatorId || isOwned) {
        return null;
    }

    return (
        <div style={{ marginTop: 8 }}>
            <Typography variant="body2" color="textSecondary">
                {hasWishlisted ? "This game is in your wishlist." : null}
            </Typography>

            {!hasWishlisted && (
                <Button variant="contained" onClick={handleWishlist} disabled={loading}>
                    Add to your wishlist
                </Button>
            )}
            <Snackbar
                open={showPopup}
                autoHideDuration={3000}
                onClose={() => setShowPopup(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setShowPopup(false)} severity="success" sx={{ width: '100%' }}>
                    Item added to your wishlist!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default WishlistButton;
