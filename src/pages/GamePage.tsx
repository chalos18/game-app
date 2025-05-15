import React from "react";
import { Container, Typography } from "@mui/material";
import Game from "../components/Game";

const GamePage = () => {
    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Game Details
            </Typography>
            <Game/>
        </Container>
    );
};

export default GamePage;
