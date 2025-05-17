import {Box, Container, Paper, Tab, Tabs, Typography} from '@mui/material';
import React from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        // TODO: logout the user if the react project is shut down
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
                    {/* TODO: add field text limits for both of the below, e.g a password cant be n digits long*/}
                    {tabIndex === 0 ? <LoginForm /> : <RegisterForm />}
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
