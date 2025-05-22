import {
    Alert, Avatar, Box, Button, Dialog, DialogContent, DialogTitle,
    IconButton, Snackbar, TextField, Typography
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import fallbackAvatar from "../assets/fallback-avatar.png";
import DeleteIcon from "@mui/icons-material/Delete";

interface EditProfileProps {
    open: boolean;
    onClose: () => void;
    onUpdated: () => void; // Call this after profile is updated
}

const EditProfile: React.FC<EditProfileProps> = ({ open, onClose, onUpdated }) => {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        currentPassword: "", newPassword: "",
        profileImageUrl: ""
    });
    const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning" | "info">("success");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userPicture, setUserPicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
            headers: { "X-Authorization": token }
        }).then(response => {
            setForm({
                ...form,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                currentPassword: "",
                newPassword: "",
                profileImageUrl: "",
            });
        });

        axios.get(`http://localhost:4941/api/v1/users/${userId}/image`, {
            responseType: 'blob'
        }).then(response => {
            setUserImageUrl(URL.createObjectURL(response.data));
        }).catch(() => setUserImageUrl(fallbackAvatar));
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const showSnackbar = (message: string, severity: typeof snackSeverity) => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSubmit = async () => {
        const { firstName, lastName, email, currentPassword, newPassword } = form;
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showSnackbar("Invalid email format", "error");
            return;
        }

        if (newPassword && !currentPassword) {
            showSnackbar("Current password is required", "error");
            return;
        }

        if (newPassword && newPassword.length < 6) {
            showSnackbar("Password must be at least 6 characters", "error");
            return;
        }

        try {
            await axios.patch(`http://localhost:4941/api/v1/users/${userId}`, {
                firstName, lastName, email,
                currentPassword, password: newPassword
            }, {
                headers: { "X-Authorization": token }
            });

            showSnackbar("Profile updated!", "success");
            onUpdated(); // Call parent to refresh profile
            onClose();   // Close dialog
        } catch (err) {
            showSnackbar("Failed to update profile", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}>
                    <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar src={userImageUrl || fallbackAvatar} sx={{ width: 80, height: 80 }} />
                    <IconButton onClick={async () => {
                        const userId = localStorage.getItem("userId");
                        const token = localStorage.getItem("token");
                        try {
                            await axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, {
                                headers: { "X-Authorization": token }
                            });
                            setUserImageUrl(fallbackAvatar);
                            showSnackbar("Profile picture removed", "success");
                        } catch {
                            showSnackbar("Failed to remove profile picture", "error");
                        }
                    }}>
                        <DeleteIcon />
                    </IconButton>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        style={{ display: 'none' }}
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
                                        setUserImageUrl(URL.createObjectURL(file));
                                        showSnackbar("Profile picture updated!", "success");
                                    }).catch(() => {
                                        showSnackbar("Failed to upload picture", "error");
                                    });
                                });
                            }
                        }}
                    />
                    <label htmlFor="game-picture">
                        <Button variant="outlined" component="span" onClick={() => fileInputRef.current?.click()}>
                            Upload Avatar
                        </Button>
                    </label>
                </Box>

                <TextField fullWidth name="firstName" label="First Name" value={form.firstName} onChange={handleChange} margin="normal" />
                <TextField fullWidth name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} margin="normal" />
                <TextField fullWidth name="email" label="Email" value={form.email} onChange={handleChange} margin="normal" />
                <TextField fullWidth name="currentPassword" label="Current Password" type="password" value={form.currentPassword} onChange={handleChange} margin="normal" />
                <TextField fullWidth name="newPassword" label="New Password" type="password" value={form.newPassword} onChange={handleChange} margin="normal" />

                <Box mt={2} textAlign="right">
                    <Button onClick={onClose} sx={{ mr: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Update</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfile;
