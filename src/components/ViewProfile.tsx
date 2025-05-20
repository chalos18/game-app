import {Avatar, Box, Typography, Paper, Alert, Snackbar} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProfile from "./EditProfile";
import fallbackAvatar from "../assets/fallback-avatar.png";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
}

const ViewProfile = () => {
    const [user, setUser] = useState<User | null>(null);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning" | "info">("success");

    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios
            .get(`http://localhost:4941/api/v1/users/${userId}/image`, {
                responseType: 'blob'
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setUserImageUrl(url);
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    setUserImageUrl(null);
                } else {
                    setUserImageUrl(fallbackAvatar);
                }
            });
    }, []);


    const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const getMyProfile = () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
            headers: {
                "X-Authorization": token,
            },
        })
            .then((response) => {
                setUser(response.data);

            })
            .catch((error) => {
                // const backendMessage = error.response.statusText || "Login failed";
                showSnackbar("Failed to fetch profile", "error");
            })
    };

    useEffect(() => {
        getMyProfile();
    }, []);

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
            <Snackbar autoHideDuration={5000}
                      open={snackOpen}
                      onClose={handleSnackClose}
                      key={snackMessage}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            <Box display="flex" alignItems="center" gap={3}>
                <img
                    src={userImageUrl || fallbackAvatar}
                    alt="User Image"
                    width={70}
                    height={70}
                    style={{borderRadius: "50%", marginRight: 8}}
                />
                <Box>
                    <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                </Box>

            </Box>
                <EditProfile/>
        </Paper>
    );
};

export default ViewProfile;
