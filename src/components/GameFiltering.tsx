import React from "react";
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
    Typography
} from "@mui/material";

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
}

const GameFilters: React.FC<GameFiltersProps> = ({
 searchTerm,
 onSearchTermChange,
 genres,
 platforms,
 selectedGenres,
 selectedPlatforms,
 price,
 onGenresChange,
 onPlatformsChange,
 onPriceChange,
 setCurrentPage,
}) => {


    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 2}}>

            <FormControl fullWidth sx={{mb: 2}}>
                <TextField
                    label="Search games"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => {
                        onSearchTermChange(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </FormControl>

            <FormControl fullWidth sx={{mb: 2}}>
                <InputLabel>Genres</InputLabel>
                <Select
                    multiple
                    value={selectedGenres}
                    label="Genres"
                    variant="outlined"
                    onChange={(e: SelectChangeEvent<number[]>) => onGenresChange(e.target.value as number[])}
                    renderValue={(selected) =>
                        genres.filter(g => selected.includes(g.genreId)).map(g => g.name).join(", ")
                    }
                >
                    {genres.map((genre) => (
                        <MenuItem key={genre.genreId} value={genre.genreId}>
                            <Checkbox checked={selectedGenres.includes(genre.genreId)}/>
                            <ListItemText primary={genre.name}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{mb: 2}}>
                <InputLabel>Platforms</InputLabel>
                <Select
                    multiple
                    label="Platforms"
                    value={selectedPlatforms}
                    onChange={(e: SelectChangeEvent<number[]>) => onPlatformsChange(e.target.value as number[])}
                    renderValue={(selected) =>
                        platforms.filter(p => selected.includes(p.platformId)).map(p => p.name).join(", ")
                    }
                >
                    {platforms.map((platform) => (
                        <MenuItem key={platform.platformId} value={platform.platformId}>
                            <Checkbox checked={selectedPlatforms.includes(platform.platformId)}/>
                            <ListItemText primary={platform.name}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography gutterBottom>Max Price: ${price / 100}</Typography>
            <Slider
                min={0}
                max={25000}
                step={100}
                value={price}
                onChange={(_, value) => onPriceChange(value as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `$${v / 100}`}
            />
        </Paper>
    );
};

export default GameFilters;
