import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CSS from "csstype";

interface Game {
    gameId: number;
    title: string;
    genreId: number;
    creationDate: string;
    creatorId: number;
    price: number;
    creatorFirstName: string;
    creatorLastName: string;
    rating: number;
    platformIds: number[];
}

const CreateGame = () => {
    const [games, setGames] = React.useState<Game[]>([]);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [newTitle, setNewTitle] = React.useState("");
    const [newDescription, setNewDescription] = React.useState("");
    const [newGenreId, setNewGenreId] = React.useState<number | "">("");
    const [newPrice, setNewPrice] = React.useState<number | "">("");
    const [newPlatformIds, setNewPlatformIds] = React.useState("");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();

    const [errors, setErrors] = React.useState({
        title: false,
        description: false,
        genreId: false,
        price: false,
        platformIds: false
    });


    React.useEffect(() => {
        getGames();
    }, []);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        console.log("Snackbar triggered:", message);
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const getGames = () => {
        axios
            .get("http://localhost:4941/api/v1/games")
            .then((response) => setGames(response.data.games))
            .catch((error) => {
                showSnackbar("Error getting games: " + error.toString(), "error");
            });
    };

    const parseValidationError = (message: string): { [key: string]: string } => {
        const rules: { [key: string]: [string, string] } = {
            "data/genreId must be >= 0": ["genreId", "Genre ID must be non-negative"],
            "No genre with id": ["genreId", "Genre ID must reference an existing genre"],
            "data/platformIds must be array": ["platformIds", "Platform IDs must be comma-separated"],
            "data/price must be integer": ["price", "Price must be a number"],
            "data/price must be >= 0": ["price", "Price must be non-negative"],
        };

        const result: { [key: string]: string } = {};
        for (const key in rules) {
            if (message.includes(key)) {
                const [field, text] = rules[key];
                result[field] = text;
            }
        }
        return result;
    };


    const addGame = (e: React.FormEvent) => {
        e.preventDefault();

        const errors: { [key: string]: string } = {};

        if (!newTitle.trim()) errors.title = "Title is required";
        if (!newDescription.trim()) errors.description = "Description is required";
        if (newGenreId === "") errors.genreId = "Genre ID is required";
        if (newPrice === "") errors.price = "Price is required";
        if (!newPlatformIds.trim()) errors.platformIds = "Platform IDs are required";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            showSnackbar("Please fix the highlighted fields", "warning");
            return;
        }

        const newErrors = {
            title: newTitle === "",
            description: newDescription === "",
            genreId: newGenreId === "",
            price: newPrice === "",
            platformIds: newPlatformIds === ""
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            showSnackbar("Please fill out all fields", "warning");
            return;
        }

        console.log(newTitle, newDescription, newGenreId, newPrice, newPlatformIds);
        const token = localStorage.getItem("token");
        axios
            .post("http://localhost:4941/api/v1/games", {
                title: newTitle,
                description: newDescription,
                genreId: Number(newGenreId),
                price: Number(newPrice),
                platformIds: newPlatformIds
                    .split(",")
                    .map(id => parseInt(id.trim()))
                    .filter(id => !isNaN(id)),
            }, {
                headers: {
                    "X-Authorization": token,
                },
            })
            .then(() => {
                getGames();
                showSnackbar("Game added successfully", "success");
                setNewTitle("");
                setNewDescription("");
                setNewGenreId("");
                setNewPrice("");
                setNewPlatformIds("");
                setErrors({
                    title: false,
                    description: false,
                    genreId: false,
                    price: false,
                    platformIds: false
                });
                setFieldErrors({});
            })
            .catch((error) => {
                const backendMessage = error.response?.data?.error ?? error.response?.statusText ?? "Error adding game";
                const parsedErrors = parseValidationError(backendMessage);
                setFieldErrors(parsedErrors);

                const fallback = Object.keys(parsedErrors).length === 0;
                showSnackbar(fallback ? backendMessage : "Please correct the highlighted fields", "error");
            });

    };


    const card: CSS.Properties = {
        padding: "20px",
        margin: "20px",
    };

    return (
        <Paper elevation={3} style={card}>
            <Snackbar
                open={snackOpen}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                style={{ zIndex: 9999 }}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: "100%" }}>
                    {snackMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h5" gutterBottom>Add a new game</Typography>
            {/*<form onSubmit={addGame}>*/}
                <Stack spacing={2}>
                    <TextField
                        label="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        error={!!fieldErrors.title}
                        helperText={fieldErrors.title || `${newTitle.length}/128 characters`}
                    />

                    <TextField
                        label="Description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        error={!!fieldErrors.description}
                        helperText={fieldErrors.description || `${newDescription.length}/1024 characters`}
                    />

                    <TextField
                        label="Genre ID"
                        type="number"
                        value={newGenreId}
                        onChange={(e) => setNewGenreId(e.target.value === "" ? "" : parseInt(e.target.value))}
                        error={!!fieldErrors.genreId}
                        helperText={fieldErrors.genreId}
                    />

                    <TextField
                        label="Price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                        error={!!fieldErrors.price}
                        helperText={fieldErrors.price}
                        slotProps={{ htmlInput: { step: 1 } }}
                    />

                    <TextField
                        label="Platform IDs (comma-separated)"
                        value={newPlatformIds}
                        onChange={(e) => setNewPlatformIds(e.target.value)}
                        error={!!fieldErrors.platformIds}
                        helperText={fieldErrors.platformIds}
                    />
                    <Button variant="contained" type="submit" onClick={addGame}>Add Game</Button>
                </Stack>
            {/*</form>*/}
        </Paper>
    );
};

export default CreateGame;
