import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, IconButton, InputAdornment, Snackbar, Stack, TextField} from '@mui/material';
import axios from "axios";
import {Visibility, VisibilityOff} from '@mui/icons-material';

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [userId, setUserId] = useState('');

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const parseValidationError = (message: string): { [key: string]: string } => {
        const rules: { [key: string]: [string, string] } = {
            "email must match format": ["email", "Please enter a valid email address"],
            "password must match format": ["password", "Password must be at least 6 characters"],
            "Email already in use": ["email", "Email already in use"],
        };

        const result: { [key: string]: string } = {};
        const parts = message.split(/[,;]+/).map(part => part.trim());

        for (const part of parts) {
            for (const key in rules) {
                if (part.includes(key)) {
                    const [field, text] = rules[key];
                    result[field] = text;
                }
            }
        }

        return result;
    };


    const handleLogin = () => {
        if (!email || !password) {
            showSnackbar("Please fill out all fields", "warning");
            return;
        }
        axios.post(`http://localhost:4941/api/v1/users/login`, {
            email: email,
            password: password,
        })
            .then((response) => {
                const {userId, token} = response.data;

                localStorage.setItem("userId", userId);
                localStorage.setItem("token", token);

                showSnackbar("User logged in successfully", "success");

                setTimeout(() => {
                    window.location.href = "/home";
                }, 500);
            })
            .catch((error) => {
                const backendMessage = error.response.statusText || "Login failed";
                const parsedErrors = parseValidationError(backendMessage);

                if (Object.keys(parsedErrors).length > 0) {
                    setFieldErrors(parsedErrors);
                    // Object.values(parsedErrors).forEach((msg) => showSnackbar(msg, "error"));
                } else {
                    showSnackbar("Login failed. Please check your inputs.", "error");
                    setFieldErrors({});
                }
            })
    };


    const handleRegister = () => {
        if (!firstName || !lastName || !email || !password) {
            showSnackbar("Please fill out all fields", "warning");
            return;
        }
        axios.post(`http://localhost:4941/api/v1/users/register`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        })
            .then((response) => {
                setUserId(response.data);

                axios.post(`http://localhost:4941/api/v1/users/login`, {
                    email: email,
                    password: password,
                })
                    .then((response) => {
                        const {userId, token} = response.data;

                        localStorage.setItem("userId", userId);
                        localStorage.setItem("token", token);

                        if (profilePicture) {
                            const formData = new FormData();
                            formData.append("image", profilePicture);

                            profilePicture.arrayBuffer().then((buffer) => {
                                axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, buffer, {
                                    headers: {
                                        "Content-Type": profilePicture.type,
                                        "X-Authorization": token,
                                    },
                                })
                                    .catch((uploadError) => {
                                        showSnackbar("Failed to upload profile picture. Please try again before registering.", "error");
                                    });
                            });
                        }

                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPassword('');
                        setFieldErrors({});
                        setProfilePicture(null);

                        showSnackbar("User registered successfully", "success");

                        setTimeout(() => {
                            window.location.href = "/home";
                        }, 500);
                    });
            })
            .catch((error) => {
                const backendMessage = error.response?.data?.error ?? error.response?.statusText ?? "Error adding game";
                const parsedErrors = parseValidationError(backendMessage);
                setFieldErrors(parsedErrors);

                const fallback = Object.keys(parsedErrors).length === 0;
                showSnackbar(fallback ? backendMessage : "Please correct the highlighted fields", "error");
            });
    };


    return (
        <Stack spacing={2}>
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

            <TextField
                label="First Name"
                fullWidth
                required={true}
                value={firstName}
                onChange={(e) => {
                    setFirstName(e.target.value);
                    setFieldErrors(prev => ({...prev, firstName: ''}));
                }}
                slotProps={{htmlInput: {maxLength: 64}}}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName || `${firstName.length}/64 characters`}
            />
            <TextField
                label="Last Name"
                fullWidth
                required={true}
                value={lastName}
                onChange={(e) => {
                    setLastName(e.target.value);
                    setFieldErrors(prev => ({...prev, lastName: ''}));
                }}
                slotProps={{htmlInput: {maxLength: 64}}}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName || `${lastName.length}/64 characters`}
            />
            <TextField
                label="Email Address"
                type="email"
                fullWidth
                required={true}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors(prev => ({...prev, email: ''}));
                }}
                slotProps={{
                    htmlInput: {
                        maxLength: 256
                    }
                }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email || `${email.length}/256 characters`}
            />
            <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                required={true}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors(prev => ({...prev, password: ''}));
                }}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <input
                accept="image/jpeg,image/png,image/gif"
                type="file"
                id="profile-picture"
                style={{display: 'none'}}
                onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }

                    if (file) {
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                        if (!validTypes.includes(file.type)) {
                            showSnackbar("Only JPEG, PNG, or GIF files are allowed.", "error");
                            return;
                        }

                        if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                        }

                        setProfilePicture(file);
                        setPreviewUrl(URL.createObjectURL(file));
                    }
                }}

            />
            <label htmlFor="profile-picture">
                <Button variant="outlined" component="span" fullWidth>
                    {profilePicture ? "Change Profile Picture" : "Upload Profile Picture (optional)"}
                </Button>
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Profile Preview"
                        style={{maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8}}
                    />
                )}
            </label>
            <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                Register
            </Button>
        </Stack>
    );
};

export default RegisterForm;
