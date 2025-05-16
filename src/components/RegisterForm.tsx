import React, {useEffect, useState} from 'react';
import {Alert, Button, IconButton, InputAdornment, Snackbar, Stack, TextField} from '@mui/material';
import axios from "axios";
import {Visibility, VisibilityOff} from '@mui/icons-material';

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [userId, setUserId] = useState('');

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        const errors: { [key: string]: string } = {};

        if (message.includes("email must match format")) {
            errors.email = "Please enter a valid email address";
        }

        if (message.includes("password must match format")) {
            errors.password = "The password must be at least 6 characters long";
        }

        if (message.includes("Email already in use")) {
            errors.email = "Email already in use";
        }

        return errors;
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

                setErrorFlag(true);
                setErrorMessage("Validation error.");
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
                setErrorFlag(false);
                setErrorMessage("");
                setUserId(response.data);
                handleLogin();

                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setFieldErrors({});

                showSnackbar("User registered successfully", "success");
            })
            .catch((error) => {
                const backendMessage = error.response.statusText;
                const parsedErrors = parseValidationError(backendMessage);

                if (Object.keys(parsedErrors).length > 0) {
                    setFieldErrors(parsedErrors);
                    // Object.values(parsedErrors).forEach((msg) => showSnackbar(msg, "error"));
                } else {
                    showSnackbar("Registration failed. Please check your inputs.", "error");
                    setFieldErrors({});
                }

                setErrorFlag(true);
                setErrorMessage("Validation error.");
            })
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
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                label="Last Name"
                fullWidth
                required={true}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                label="Email Address"
                type="email"
                fullWidth
                required={true}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors(prev => ({...prev, email: ''}));  // Clear error on change
                }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
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
            <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                Register
            </Button>
        </Stack>
    );
};

export default RegisterForm;
