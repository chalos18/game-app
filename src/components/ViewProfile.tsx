import EditProfile from "./EditProfile";
import {Alert, Box, Button, IconButton, Paper, Snackbar, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import CSS from "csstype";
import fallbackAvatar from "../assets/fallback-avatar.png";
import DeleteIcon from "@mui/icons-material/Delete";
import {useUserContext} from "../contexts/UserContext";


const ProfilePage = () => {
    const [editOpen, setEditOpen] = useState(false);
    const [user, setUser] = useState<User>({firstName: "", lastName: "", email: ""});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const {avatarUrl, setAvatarUrl} = useUserContext();

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning" | "info">("success");


    const showSnackbar = (message: string, severity: typeof snackSeverity) => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const fetchProfile = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
            headers: {"X-Authorization": token}
        });
        setUser(res.data);
    };

    React.useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios
            .get(`http://localhost:4941/api/v1/users/${userId}/image`, {
                responseType: 'blob'
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setAvatarUrl(url);
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    setAvatarUrl(null);
                } else {
                    setAvatarUrl(fallbackAvatar);
                }
            });
    }, []);

    useEffect(() => {
        fetchProfile();
    }, []);

    const card: CSS.Properties = {
        padding: "20px",
        margin: "20px",
    };


    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    return (
        <Paper elevation={3} style={card} sx={{backgroundColor: "white", margin: "40px"}}>
            <Snackbar
                open={snackOpen}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                style={{zIndex: 9999}}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: "100%"}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <img
                        src={avatarUrl || fallbackAvatar}
                        alt="Profile"
                        style={{
                            width: "200px",
                            height: "200px",
                            borderRadius: "10%",
                            objectFit: "cover",
                            marginBottom: "10px"
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />

                    <Box display="flex" gap={1} mb={1}>
                        <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                            {avatarUrl ? "Change Avatar" : "Upload Avatar"}
                        </Button>
                        <IconButton onClick={async () => {
                            const userId = localStorage.getItem("userId");
                            const token = localStorage.getItem("token");
                            try {
                                await axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, {
                                    headers: {"X-Authorization": token}
                                });
                                setAvatarUrl(fallbackAvatar);
                                showSnackbar("Profile picture removed", "success");
                            } catch (error: any) {
                                const backendMessage = error.response.statusText || "Failed to remove avatar";

                                if (backendMessage.includes("Not Found")) {
                                    showSnackbar("No user avatar found", "error");
                                } else {
                                    showSnackbar("Failed to remove avatar", "error");
                                }

                            }

                        }}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        style={{display: 'none'}}
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const token = localStorage.getItem("token");
                                const userId = localStorage.getItem("userId");
                                file.arrayBuffer().then(buffer => {
                                    axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, buffer, {
                                        headers: {
                                            "Content-Type": file.type,
                                            "X-Authorization": token
                                        }
                                    }).then(() => {
                                        const imageUrl = URL.createObjectURL(file);
                                        setAvatarUrl(imageUrl);
                                        showSnackbar("Profile picture updated!", "success");
                                    }).catch(() => {
                                        showSnackbar("Failed to upload picture", "error");
                                    });
                                });
                            }
                        }}
                    />
                </Box>

                <Typography variant={"h5"} color="textPrimary">
                    Welcome, {user.firstName} {user.lastName}
                </Typography>

                <Typography variant="body2" color="inherit" noWrap>
                    &nbsp;
                </Typography>

                <Typography variant={"body2"} color="textSecondary">
                    {user.email}
                </Typography>

                <Typography variant="body2" color="inherit" noWrap>
                    &nbsp;
                </Typography>

                <Button variant="outlined" onClick={() => setEditOpen(true)}>Edit Profile</Button>

                <EditProfile
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onUpdated={fetchProfile}
                />
            </Box>
        </Paper>
    );


};

export default ProfilePage;
