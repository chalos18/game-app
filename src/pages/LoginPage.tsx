import {
    Container,
    Typography,
} from '@mui/material';
import Login from "../components/Login";

const LoginPage = () => {

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom></Typography>
            <Login/>
        </Container>
    );
};

export default LoginPage;
