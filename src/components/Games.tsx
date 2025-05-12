import axios from "axios";
import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"
import {Link, useNavigate, useParams } from "react-router-dom";


const Games = () => {
    const [games, setGames] = React.useState < Array < Game >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const navigate = useNavigate();

    // React.useEffect -> fetches all games when the page
    React.useEffect(() => {
        getGames()
    }, [])

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [dialogGame, setDialogGame] = React.useState<Game>({
        creationDate: "",
        creatorFirstName: "",
        creatorId: 0,
        creatorLastName: "",
        genreId: 0,
        price: 0,
        rating: 0,
        gameId:0, title:""})

    const handleDeleteDialogOpen = (game: Game) => {
        setDialogGame(game)
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogGame({ creationDate: "",
            creatorFirstName: "",
            creatorId: 0,
            creatorLastName: "",
            genreId: 0,
            price: 0,
            rating: 0,
            gameId:0, title:"" })
        setOpenDeleteDialog(false);
    };

    const deleteGame = (game: Game) => {
        axios.delete('http://localhost:4941/api/v1/games/' + game.gameId)
            .then(response => {
                navigate('/games')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }


    const getGames = () => {
        axios.get('http://localhost:4941/api/v1/games')
            .then((response) => {
                console.log("API response:", response.data);
                setErrorFlag(false)
                setErrorMessage("")
                setGames(response.data.games)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const list_of_games = () => {
        return games.map((game) =>
            <tr key={game.gameId}>
                <th scope={"row"}>{game.gameId}</th>
                <td>{game.title}</td>
                <td>{game.creationDate}</td>
                <td>{game.creatorFirstName}</td>
                <td>{game.creatorLastName}</td>
                <td>{game.creatorId}</td>
                <td>{game.genreId}</td>
                <td>{game.price}</td>
                <td>{game.rating}</td>
                <td><Link to={"/games/" + game.gameId}> Go to game </Link></td>
                <td>
                    <button type="button" onClick={() => handleDeleteDialogOpen(game)}>
                        Delete
                    </button>
                    <button type="button">Edit</button>
                </td>
            </tr>
        )
    }


    if (errorFlag) {
        return (
            <div>
                <h1>Games</h1>
                <div style={{ color: "pink" }}>
                    {/*error div displayed if there is an issue fetching games*/}
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Games</h1>
                {/*table to render games*/}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Creation Date</th>
                            <th scope="col">Creator first name</th>
                            <th scope="col">Creator last name</th>
                            <th scope="col">Creator ID</th>
                            <th scope="col">Genre ID</th>
                            <th scope="col">Price</th>
                            <th scope="col">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*get all the table rows based on our games*/}
                        {list_of_games()}
                    </tbody>
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleDeleteDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"Delete Game?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this game: <strong>{dialogGame.title}</strong>?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    deleteGame(dialogGame)
                                    handleDeleteDialogClose()
                                    getGames()
                                }}
                                autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
            </table>
            </div>
        )
    }
}

export default Games;
