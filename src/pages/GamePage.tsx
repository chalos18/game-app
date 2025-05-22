import React from "react";
import { Container } from "@mui/material";
import Game from "../components/Game";

const GamePage = () => {
    return (
        <Container sx={{ marginTop: 4 }}>
            <Game/>
        </Container>
    );
};

export default GamePage;
