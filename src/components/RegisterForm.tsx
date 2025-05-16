import React, { useState } from 'react';
import {Button, TextField, Stack, Alert, Snackbar, AlertTitle} from '@mui/material';
import axios from "axios";

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning">("success");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});



    const showSnackbar = (message: string, severity: "success" | "error" | "warning") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
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


    const handleRegister = () => {
        if (!firstName || !lastName || !email || !password ) {
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors(prev => ({ ...prev, email: '' }));  // Clear error on change
                }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                Register
            </Button>
        </Stack>
    );
};

export default RegisterForm;
