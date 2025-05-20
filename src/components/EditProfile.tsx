import {
    Avatar, Box, Button, TextField, Typography, Paper, IconButton, Alert, Snackbar
} from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import fallbackAvatar from "../assets/fallback-avatar.png";

const EditProfile = () => {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        currentPassword: "", newPassword: "",
        profileImageUrl: ""
    });
    const [error, setError] = useState("");

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning" | "info">("success");

    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);

    const [user, setUser] = React.useState<User>({
        firstName: "",
        lastName: "",
        email: "",
    })

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

    const getMyProfile = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
            headers: {
                "X-Authorization": token,
            },
        })
            .then((response) => {
                console.log(response.data);
                setUser(response.data);
            });
    };

    const updateProfile = async (profileData: any) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        axios.patch(`http://localhost:4941/api/v1/users/${userId}`, {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            currentPassword: profileData.currentPassword,
            password: profileData.newPassword,
        }, {
            headers: {
                "X-Authorization": token,
            },
        })
            .then((response) => {
                setUser(response.data);
                setForm(f => ({
                    ...f,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                }));
            })
            .catch((error) => {
                const backendMessage = error.response.statusText || "Login failed";
                showSnackbar("Failed to fetch profile", "error");
            });

    };

    useEffect(() => {
        getMyProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async () => {
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError("Invalid email format.");
            return;
        }
        if (form.newPassword && !form.currentPassword) {
            setError("Current password is required to set a new password.");
            return;
        }
        if (form.newPassword && form.newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        try {
            await updateProfile(form);
            alert("Profile updated!");
        } catch (err: any) {
            setError(err.response?.data?.message || "Update failed");
        }
    };


    const handleRemovePicture = () => {
        setForm(f => ({ ...f, profileImageUrl: "" }));
    };

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

            <Typography variant="h5" gutterBottom>Edit Profile</Typography>

            {/*<Box display="flex" alignItems="center" gap={2} mb={2}>*/}
            {/*    <Avatar src={form.profileImageUrl || undefined} sx={{ width: 80, height: 80 }} />*/}
            {/*    <IconButton onClick={handleRemovePicture}><DeleteIcon /></IconButton>*/}
            {/*</Box>*/}

            <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Current Password" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="New Password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} margin="normal" />

            {error && <Typography color="error">{error}</Typography>}

            <Box mt={2}>
                <Button variant="contained" onClick={handleSubmit}>Update Profile</Button>
            </Box>
        </Paper>
    );
};

export default EditProfile;
