import * as React from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useGameStore} from "../store";
import {Alert, AlertTitle, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import GameListObject from "./GameListObject";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MyOwnedGames from "./GamesOwnedByMe";
import MyReviewedGames from "./GamesReviewedByMe";
import GamesCreatedByMe from "./GamesCreatedByMe";
import GamesWishlistedByMe from "./GamesWishlistedByMe";
import GamesReviewedByMe from "./GamesReviewedByMe";
import GamesOwnedByMe from "./GamesOwnedByMe";


const MyGames = () => {

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#172D2D"}}>
                <div className="p-4 space-y-4">

                    <GamesOwnedByMe />

                    <GamesWishlistedByMe />

                    <GamesCreatedByMe />

                    <GamesReviewedByMe />
                </div>
            </Paper>
        </Container>
    );

}

export default MyGames;