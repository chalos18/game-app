import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import NavBar from "../components/NavBar";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        // TODO: Add login API call
        console.log('Logging in with', email, password);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Log In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
