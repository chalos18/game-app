import React, {useRef, useState} from "react";
import axios from "axios";
import {
    Alert,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
    const [newPlatformIds, setNewPlatformIds] = React.useState<number[]>([]);

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const [genres, setGenres] = React.useState<{ genreId: number, name: string }[]>([]);
    const [platforms, setPlatforms] = React.useState<{ platformId: number, name: string }[]>([]);

    const [gamePicture, setGamePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        getGames();
        getGenres();
        getPlatforms();
    }, []);

    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
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

    const getGenres = () => {
        axios
            .get("http://localhost:4941/api/v1/games/genres")
            .then((response) => setGenres(response.data))
            .catch((error) => {
                showSnackbar("Error getting genres: " + error.toString(), "error");
            });
    };

    const getPlatforms = () => {
        axios
            .get("http://localhost:4941/api/v1/games/platforms")
            .then((response) => {
                setPlatforms(response.data)
            })
            .catch((error) => {
                showSnackbar("Error getting platforms: " + error.toString(), "error");
            });
    };

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


    const addGame = (e: React.FormEvent) => {
        e.preventDefault();

        const errors: { [key: string]: string } = {};

        if (!newTitle.trim()) errors.title = "Title is required";
        if (!newDescription.trim()) errors.description = "Description is required";
        if (newGenreId === "") errors.genreId = "Genre is required";
        if (newPrice === "") errors.price = "Price is required";
        if (newPrice > 250) errors.price = "Max price is $250";
        if (newPlatformIds.length === 0) errors.platformIds = "One or more platforms required";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            showSnackbar("Please fix the highlighted fields", "warning");
            return;
        }

        const token = localStorage.getItem("token");
        axios
            .post("http://localhost:4941/api/v1/games", {
                title: newTitle,
                description: newDescription,
                genreId: Number(newGenreId),
                price: Math.round(Number(newPrice) * 100),
                platformIds: newPlatformIds,
            }, {
                headers: {
                    "X-Authorization": token,
                },
            })
            .then((response) => {
                const {gameId} = response.data;

                if (gamePicture) {
                    const formData = new FormData();
                    formData.append("image", gamePicture);

                    gamePicture.arrayBuffer().then((buffer) => {
                        axios.put(`http://localhost:4941/api/v1/games/${gameId}/image`, buffer, {
                            headers: {
                                "Content-Type": gamePicture.type,
                                "X-Authorization": token,
                            },
                        })
                            .catch((uploadError) => {
                                showSnackbar("Failed to upload profile picture. Please try again before registering.", "error");
                            });
                    });
                }
                getGames();
                showSnackbar("Game added successfully", "success");
                setNewTitle("");
                setNewDescription("");
                setNewGenreId("");
                setNewPrice("");
                setNewPlatformIds([]);
                setFieldErrors({});
                setGamePicture(null);
                setPreviewUrl(null);
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
        <Paper elevation={3} style={card} sx={{backgroundColor: "white"}}>
            <Snackbar
                open={snackOpen}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                style={{zIndex: 9999}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h5" gutterBottom>Add a new game</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Title"
                    value={newTitle}
                    required
                    onChange={(e) => setNewTitle(e.target.value)}
                    error={!!fieldErrors.title}
                    helperText={fieldErrors.title || `${newTitle.length}/128 characters`}
                />

                <TextField
                    label="Description"
                    value={newDescription}
                    required
                    onChange={(e) => setNewDescription(e.target.value)}
                    error={!!fieldErrors.description}
                    helperText={fieldErrors.description || `${newDescription.length}/1024 characters`}
                />

                <FormControl fullWidth error={!!fieldErrors.genreId} sx={{textAlign: 'left', alignItems: 'flex-start'}}>
                    <InputLabel id="genre-select-label">Genre *</InputLabel>
                    <Select<number | "">
                        labelId="genre-select-label"
                        id="genre-select"
                        value={newGenreId}
                        fullWidth
                        required
                        label="Genre"
                        onChange={(e) => setNewGenreId(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                },
                            },
                        }}
                    >
                        <MenuItem value="">None</MenuItem>
                        {genres.map((genre) => (
                            <MenuItem key={genre.genreId} value={genre.genreId}>
                                {genre.name}
                            </MenuItem>
                        ))}
                    </Select>


                    {fieldErrors.genreId && (
                        <Typography variant="caption" color="error" sx={{pl: '14px'}}>
                            {fieldErrors.genreId}
                        </Typography>
                    )}
                </FormControl>

                <TextField
                    label="Price"
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => {
                        const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                        if (value === 250) {
                            showSnackbar("$250 is the maximum allowed price", "warning");
                        }
                        setNewPrice(value);
                    }}
                    error={!!fieldErrors.price}
                    helperText={fieldErrors.price}
                    slotProps={{
                        input: {
                            inputProps: {min: 0, max: 250, step: 0.01}
                        }
                    }}
                />

                <InputLabel id="platforms-select-label">Platforms *</InputLabel>
                <FormControl component="fieldset" error={!!fieldErrors.platformIds}>
                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                        {platforms.map((platform) => (
                            <FormControlLabel
                                key={platform.platformId}
                                control={
                                    <Checkbox
                                        checked={newPlatformIds.includes(platform.platformId)}
                                        onChange={(e) => {
                                            const id = platform.platformId;
                                            setNewPlatformIds(prev =>
                                                e.target.checked
                                                    ? [...prev, id]
                                                    : prev.filter(pid => pid !== id)
                                            );
                                        }}
                                    />
                                }
                                label={platform.name}
                            />
                        ))}
                    </Stack>
                    {fieldErrors.platformIds && (
                        <Typography variant="caption" color="error" sx={{pl: '14px'}}>
                            {fieldErrors.platformIds}
                        </Typography>
                    )}
                </FormControl>

                <input
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/gif"
                    type="file"
                    id="game-picture"
                    style={{display: 'none'}}
                    onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }

                        if (file) {
                            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                            if (!validTypes.includes(file.type)) {
                                showSnackbar("Only JPEG, PNG, or GIF files are allowed.", "error");
                                return;
                            }

                            if (previewUrl) {
                                URL.revokeObjectURL(previewUrl);
                            }

                            setGamePicture(file);
                            setPreviewUrl(URL.createObjectURL(file));
                        }
                    }}
                />
                <label htmlFor="game-picture">
                    <Button variant="outlined" component="span" fullWidth>
                        {gamePicture ? "Change Game Picture" : "Upload Game Picture (optional)"}
                    </Button>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Game Picture Preview"
                            style={{maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8}}
                        />
                    )}
                </label>

                <Button variant="contained" type="submit" onClick={addGame}>Add Game</Button>
            </Stack>
        </Paper>
    );
};

export default CreateGame;
