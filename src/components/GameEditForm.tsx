import {
    Alert,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import {useState} from "react";

interface GameEditFormProps {
    game: Game;
    genres: { genreId: number; name: string }[];
    platforms: { platformId: number; name: string }[];
    onUpdate: (updatedGame: {
        newTitle: string;
        newDescription: string;
        newGenreId: number | "";
        newPrice: number | "";
        newPlatformIds: number[];
    }) => void;
    onCancel: () => void;
}

const GameEditForm = ({game, genres, platforms, onUpdate, onCancel}: GameEditFormProps) => {
    const [newTitle, setNewTitle] = useState(game.title ?? "");
    const [newDescription, setNewDescription] = useState(game.description ?? "");
    const [newGenreId, setNewGenreId] = useState<number | "">(game.genreId ?? "");
    const [newPrice, setNewPrice] = useState<number | "">(game.price);
    const [newPlatformIds, setNewPlatformIds] = useState<number[]>(Array.isArray(game.platformIds) ? game.platformIds : []);

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning">("success");

    const [fieldErrors, setFieldErrors] = useState({
        title: undefined,
        description: undefined,
        price: undefined,
        genreId: undefined,
        platformIds: undefined
    } as {
        title?: string;
        description?: string;
        price?: string;
        genreId?: string;
        platformIds?: string;
    });

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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

        setFieldErrors({});
        showSnackbar("Game updated successfully!", "success");

        onUpdate({
            newTitle: newTitle,
            newDescription: newDescription,
            newPrice: newPrice,
            newGenreId: newGenreId,
            newPlatformIds: newPlatformIds
        });

        setTimeout(() => {
            setSnackOpen(false);
            onCancel();
        }, 500);
    };

    return (
        <Paper elevation={3} sx={{backgroundColor: "white", p: 3, m: 2}} component="form" onSubmit={handleSubmit}>
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                style={{zIndex: 9999}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>

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

                <FormControl fullWidth error={!!fieldErrors.genreId}>
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
                                    overflowY: "auto"
                                }
                            }
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
                        <FormHelperText>{fieldErrors.genreId}</FormHelperText>
                    )}
                </FormControl>

                <TextField
                    label="Price"
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    error={!!fieldErrors.price}
                    helperText={fieldErrors.price}
                    inputProps={{step: 1}}
                />

                <FormControl component="fieldset" error={!!fieldErrors.platformIds}>
                    <InputLabel shrink>Platforms *</InputLabel>
                    <FormGroup row>
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
                    </FormGroup>
                    {fieldErrors.platformIds && (
                        <FormHelperText>{fieldErrors.platformIds}</FormHelperText>
                    )}
                </FormControl>

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Save Changes
                    </Button>
                    <Button onClick={onCancel} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default GameEditForm;
