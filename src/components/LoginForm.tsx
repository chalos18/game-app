import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import axios from "axios";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useNavigate} from 'react-router-dom';


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState<"success" | "error" | "warning" | "info">("success");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            showSnackbar("You are already logged in.", "info");
            navigate("/home");
        }
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
                } else {
                    showSnackbar("Login failed. Please check your inputs.", "error");
                    setFieldErrors({});
                }
            })
    };

    return (
        <Container maxWidth="sm" sx={{mt: 8}}>
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

            <Paper elevation={3} sx={{padding: 4}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Log in
                </Typography>
                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }} noValidate>
                    <Stack spacing={2}>
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
                    </Stack>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{mt: 3}}
                    >
                        Log in
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginForm;
