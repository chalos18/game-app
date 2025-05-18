import * as React from 'react';
import {Container, Paper} from "@mui/material";
import GamesOwnedByMe from "./GamesOwnedByMe";
import GamesReviewedByMe from "./GamesReviewedByMe";
import GamesCreatedByMe from "./GamesCreatedByMe";
import GamesWishlistedByMe from "./GamesWishlistedByMe";


const MyGames = () => {

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#172D2D"}}>
                <div className="p-4 space-y-4">

                    <GamesOwnedByMe/>

                    <GamesWishlistedByMe/>

                    <GamesCreatedByMe/>

                    <GamesReviewedByMe/>
                </div>
            </Paper>
        </Container>
    );

}

export default MyGames;