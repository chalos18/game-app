import React, {useState} from "react";
import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Slider,
    TextField,
    Typography,
    Button, Box,
} from "@mui/material";

import Grid from '@mui/material/Grid';


import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';

interface GameFiltersProps {
    searchTerm: string;
    genres: { genreId: number, name: string }[];
    platforms: { platformId: number, name: string }[];
    selectedGenres: number[];
    selectedPlatforms: number[];
    price: number;
    onGenresChange: (ids: number[]) => void;
    onPlatformsChange: (ids: number[]) => void;
    onPriceChange: (price: number) => void;
    onSearchTermChange: (term: string) => void;
    setCurrentPage: (page: number) => void;
    sortBy: string;
    onSortByChange: (sort: string) => void;
}

const GameFilters  = (props: GameFiltersProps) => {

    const [showFilters, setShowFilters] = useState(false);

    const clearFilters = () => {
        props.onSearchTermChange("");
        props.onGenresChange([]);
        props.onPlatformsChange([]);
        props.onPriceChange(25000);
        props.onSortByChange("CREATED_ASC");
        props.setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        props.onSortByChange(value);
        props.setCurrentPage(1);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                    label="Search games"
                    fullWidth
                    value={props.searchTerm}
                    onChange={(e) => {
                        props.onSearchTermChange(e.target.value);
                        props.setCurrentPage(1);
                    }}
                />
            </FormControl>

            <Button
                variant="contained"
                onClick={() => setShowFilters((prev) => !prev)}
                sx={{ mb: 2 }}
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            {showFilters && (
                <>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Genres</InputLabel>
                        <Select
                            multiple
                            value={props.selectedGenres}
                            label="Genres"
                            variant="outlined"
                            onChange={(e: SelectChangeEvent<number[]>) => props.onGenresChange(e.target.value as number[])}
                            renderValue={(selected) =>
                                props.genres.filter(g => selected.includes(g.genreId)).map(g => g.name).join(", ")
                            }
                        >
                            {props.genres.map((genre) => (
                                <MenuItem key={genre.genreId} value={genre.genreId}>
                                    <Checkbox checked={props.selectedGenres.includes(genre.genreId)} />
                                    <ListItemText primary={genre.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Platforms</InputLabel>
                        <Select
                            multiple
                            label="Platforms"
                            value={props.selectedPlatforms}
                            onChange={(e: SelectChangeEvent<number[]>) => props.onPlatformsChange(e.target.value as number[])}
                            renderValue={(selected) =>
                                props.platforms.filter(p => selected.includes(p.platformId)).map(p => p.name).join(", ")
                            }
                        >
                            {props.platforms.map((platform) => (
                                <MenuItem key={platform.platformId} value={platform.platformId}>
                                    <Checkbox checked={props.selectedPlatforms.includes(platform.platformId)} />
                                    <ListItemText primary={platform.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography gutterBottom>Max Price: ${props.price / 100}</Typography>
                    <Slider
                        min={0}
                        max={25000}
                        step={100}
                        value={props.price}
                        onChange={(_, value) => props.onPriceChange(value as number)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `$${v / 100}`}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Sort Options</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel><SortByAlphaIcon fontSize="small" sx={{ mr: 1 }} /> Alphabetical</InputLabel>
                            <Select
                                label={<SortByAlphaIcon fontSize="small" sx={{ mr: 1 }} /> + "Alphabetical"}
                                value={props.sortBy.startsWith("ALPHABETICAL") ? props.sortBy : ""}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <MenuItem value="ALPHABETICAL_ASC">A-Z</MenuItem>
                                <MenuItem value="ALPHABETICAL_DESC">Z-A</MenuItem>
                            </Select>
                        </FormControl>


                        <FormControl fullWidth>
                            <InputLabel><AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> Price</InputLabel>
                            <Select
                                label={<AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> + "Price"}
                                value={props.sortBy.startsWith("PRICE") ? props.sortBy : ""}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <MenuItem value="PRICE_ASC">Low to High</MenuItem>
                                <MenuItem value="PRICE_DESC">High to Low</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel><StarIcon fontSize="small" sx={{ mr: 1 }} /> Rating</InputLabel>
                            <Select
                                label={<StarIcon fontSize="small" sx={{ mr: 1 }} /> + "Rating"}
                                value={props.sortBy.startsWith("RATING") ? props.sortBy : ""}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <MenuItem value="RATING_ASC">Low to High</MenuItem>
                                <MenuItem value="RATING_DESC">High to Low</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel><AccessTimeIcon fontSize="small" sx={{ mr: 1 }} /> Created</InputLabel>
                            <Select
                                label={<AccessTimeIcon fontSize="small" sx={{ mr: 1 }} /> + "Created"}
                                value={props.sortBy.startsWith("CREATED") ? props.sortBy : ""}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <MenuItem value="CREATED_ASC">Oldest First</MenuItem>
                                <MenuItem value="CREATED_DESC">Newest First</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={clearFilters}
                        startIcon={<ClearIcon />}
                    >
                        Clear Filters
                    </Button>
                </>
            )}
        </Paper>
    );
};

export default GameFilters;
