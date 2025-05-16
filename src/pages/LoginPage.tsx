import { Container, Typography, Tabs, Tab, Box, Paper } from '@mui/material';
import React from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome
                </Typography>
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>
                <Box sx={{ mt: 3 }}>
                    {tabIndex === 0 ? <LoginForm /> : <RegisterForm />}
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
