import axios from "axios";
import React from "react";
import {Link, useNavigate, useParams } from "react-router-dom";

// Commonly tsx file are placed in either a components or pages directory. With the distinction being
// a page is often tied to a route and is composed of many components, with components being the tsx that
// encapsulates smaller functionality.

// useParams function allows us to access the id variable from our path
const Game = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    // this is using the React useState hook to declare a piece of state called game with its initial value
    // setGame is called later with the response data that then overrides the initialisation of game
    // the initialisation ensure that the component can render safely before the API call completes
    const [game, setGame] = React.useState<Game>({
        creationDate: "",
        creatorFirstName: "",
        creatorId: 0,
        creatorLastName: "",
        genreId: 0,
        price: 0,
        rating: 0,
        gameId:0, title:""})


    const deleteGame = (game: Game) => {
        axios.delete('http://localhost:4941/api/v1/games/' + id)
            .then(response => {
                navigate('/games')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
        })
    }

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const getGame = () => {
            axios.get('http://localhost:4941/api/v1/games/' + id)
                .then((response) => {
                    console.log("API response:", response.data);
                    setErrorFlag(false)
                    setErrorMessage("")
                    setGame(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getGame()
    }, [id])

    if (errorFlag) {
        return (
            <div>
                <h1>Game</h1>
                <div style={{ color: "pink" }}>
                    {errorMessage}
                </div>
                <Link to={"/games/"}>Back to games</Link>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Game</h1>
                {game.gameId}: {game.title}
                <Link to={"/games/"}>Back to games</Link>
                <button type={"button"}>
                    Edit
                </button>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#deleteGameModal">
                    Delete
                </button>
            </div>
        )
    }
}

export default Game;
