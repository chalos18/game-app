import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import fallbackAvatar from "../assets/fallback-avatar.png";
import DeleteIcon from "@mui/icons-material/Delete";
import {Visibility, VisibilityOff } from "@mui/icons-material";

interface EditProfileProps {
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({open, onClose, onUpdated}) => {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        currentPassword: "", newPassword: "",
        profileImageUrl: ""
    });
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning" | "info">("success");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
            headers: {"X-Authorization": token}
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

        if (open) {
            setSnackOpen(false);
            setSnackMessage("");
            setSnackSeverity("success");
            setFieldErrors({});
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(f => ({...f, [name]: value}));
    };

    const showSnackbar = (message: string, severity: typeof snackSeverity) => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const parseValidationError = (message: string): { [key: string]: string } => {
        const errors: { [key: string]: string } = {};

        if (message.toLowerCase().includes("email") && message.toLowerCase().includes("in use")) {
            errors.email = "Email already in use";
        }

        if (message.toLowerCase().includes("email must match format")) {
            errors.email = "Please enter a valid email address";
        }

        if (message.includes("Incorrect currentPassword")) {
            errors.currentPassword = "Current password is incorrect";
        }

        if (message.toLowerCase().includes("password must match format")) {
            errors.newPassword = "Password must be at least 6 characters";
        }

        return errors;
    };


    const handleSubmit = async () => {
        const {firstName, lastName, email, currentPassword, newPassword} = form;
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const newErrors: {[key: string]: string} = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        const isChangingPassword = currentPassword || newPassword;

        if (isChangingPassword) {
            if (!currentPassword) {
                newErrors.currentPassword = "Current password is required to change password";
            }
            if (!newPassword) {
                newErrors.newPassword = "New password is required";
            }
            // if (currentPassword && currentPassword.length < 6) {
            //     newErrors.currentPassword = "Current password must be at least 6 characters";
            // }
            if (newPassword && newPassword.length < 6) {
                newErrors.newPassword = "New password must be at least 6 characters";
            }
            if (currentPassword && newPassword && currentPassword === newPassword) {
                newErrors.newPassword = "New password must be different from current password";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        try {
            const payload: any = { firstName, lastName, email };
            if (currentPassword && newPassword) {
                payload.currentPassword = currentPassword;
                payload.password = newPassword;
            }

            await axios.patch(`http://localhost:4941/api/v1/users/${userId}`, payload, {
                headers: { "X-Authorization": token }
            });

            showSnackbar("Profile updated!", "success");
            setFieldErrors({});
            onUpdated();
            onClose();
        } catch (error: any) {
            const backendMessage = error.response?.statusText || "Failed to update profile";
            console.log(backendMessage);

            const parsedErrors = parseValidationError(backendMessage);
            if (Object.keys(parsedErrors).length > 0) {
                setFieldErrors(parsedErrors);
            } else {
                showSnackbar(backendMessage, "error");
            }
        }
    };



    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
        setSnackMessage("");
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };


    return (
        <>
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
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

                <DialogTitle>Edit Profile</DialogTitle>

                <DialogContent>

                    <TextField fullWidth name="firstName" label="First Name" value={form.firstName} onChange={handleChange}
                               margin="normal" error={!!fieldErrors.firstName}
                               helperText={fieldErrors.firstName || `${form.firstName.length}/64 characters`}
                               slotProps={{htmlInput: {maxLength: 64}}}/>

                    <TextField fullWidth name="lastName" label="Last Name" value={form.lastName} onChange={handleChange}
                               margin="normal"
                               error={!!fieldErrors.lastName}
                               helperText={fieldErrors.lastName || `${form.lastName.length}/64 characters`}
                               slotProps={{htmlInput: {maxLength: 64}}}/>

                    <TextField fullWidth name="email" label="Email" value={form.email}
                               onChange={(e) => {
                                   handleChange(e);
                                   setFieldErrors(prev => ({...prev, email: ''}));
                               }}
                               margin="normal"
                               error={!!fieldErrors.email}
                               helperText={fieldErrors.email || `${form.email.length}/256 characters`}
                               slotProps={{htmlInput: {maxLength: 256}}}/>

                    <TextField
                        fullWidth
                        name="currentPassword"
                        label="Current Password"
                        type={showPassword ? "text" : "password"}
                        value={form.currentPassword}
                        onChange={handleChange}
                        margin="normal"
                        error={!!fieldErrors.currentPassword}
                        helperText={fieldErrors.currentPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={form.newPassword}
                        onChange={handleChange}
                        margin="normal"
                        error={!!fieldErrors.newPassword}
                        helperText={fieldErrors.newPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box mt={2} textAlign="right">
                        <Button onClick={onClose} sx={{mr: 2}}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit}>Update</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditProfile;
