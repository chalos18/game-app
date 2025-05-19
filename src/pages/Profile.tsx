import * as React from 'react';
import {Box, Container, Paper, Tab, Tabs,} from "@mui/material";

import GamesCreatedByMe from "../components/GamesCreatedByMe";
import GamesWishlistedByMe from "../components/GamesWishlistedByMe";
import GamesReviewedByMe from "../components/GamesReviewedByMe";
import GamesOwnedByMe from "../components/GamesOwnedByMe";
import CreateGame from "../components/CreateGame";

const MyGames = () => {
    const [selectedSection, setSelectedSection] = React.useState("createGames");

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedSection(newValue);
    };

    const renderSection = () => {
        switch (selectedSection) {
            case "createGames":
                return <CreateGame/>;
            case "owned":
                return <GamesOwnedByMe/>;
            case "wishlisted":
                return <GamesWishlistedByMe/>;
            case "created":
                return <GamesCreatedByMe/>;
            case "reviewed":
                return <GamesReviewedByMe/>;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Paper elevation={3} sx={{p: 3, backgroundColor: "#172D2D", minHeight: '80vh'}}>
                {/* Top Nav Tabs */}
                <Box sx={{borderBottom: 1, borderColor: 'divider', backgroundColor: 'white', borderRadius: 1, mb: 3}}>
                    <Tabs
                        value={selectedSection}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Create Game" value="createGames"/>
                        <Tab label="Owned Games" value="owned"/>
                        <Tab label="Wishlisted Games" value="wishlisted"/>
                        <Tab label="Created Games" value="created"/>
                        <Tab label="Reviewed Games" value="reviewed"/>
                    </Tabs>
                </Box>

                {/* Main Content */}
                <Box>
                    {renderSection()}
                </Box>
            </Paper>
        </Container>
    );
};

export default MyGames;
