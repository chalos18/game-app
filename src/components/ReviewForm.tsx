import React, { useState } from "react";
import {
    Box, Button, TextField, Typography, Rating, Alert
} from "@mui/material";
import axios from "axios";

interface ReviewFormProps {
    gameId: number;
    gameTitle: string;
    creatorId: number;
    currentUser: { id: number, isAuthenticated: boolean };
    onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
       gameId,
       gameTitle,
       creatorId,
       currentUser,
       onReviewSubmitted
    }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");


    const handleSubmit = () => {
        if (!currentUser.isAuthenticated) {
            setError("Register or log in to leave a review");
            return;
        }

        if (currentUser.id === creatorId) {
            setError("You can not review your own game");
            return;
        }

        if (rating === null || rating < 1 || rating > 10) {
            setError("Please select a rating between 1 and 10");
            return;
        }

        const body: any = { rating };
        if (message.trim() !== "") {
            body.review = message.trim();
        }

        axios.post(`http://localhost:4941/api/v1/games/${gameId}/reviews`, body, {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }).then(() => {
            setError("");
            setRating(null);
            setMessage("");
            onReviewSubmitted();
        }).catch((error) => {
            const serverMessage = error.response.statusText;

            if (error.response.statusText.includes("Cannot post more than one review on a game.")){
                setError("You can not post more than one review on a game");
            } else {
                setError("Failed to submit review: " + (serverMessage || error.message));
            }
        });
    };

    return (
        <Box mt={3}>
            <Typography variant="h6">
                Write a review for {gameTitle}
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
                Please describe what you liked or disliked about this game and whether you recommend it to others.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box mb={2}>
                <Typography component="legend">Rating (1-10)</Typography>
                <Rating
                    name="rating"
                    max={10}
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                />
            </Box>

            <TextField
                label="Your review (optional)"
                multiline
                minRows={3}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
            >
                Submit Review
            </Button>
        </Box>
    );
};

export default ReviewForm;
