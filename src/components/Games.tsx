import axios from "axios";
import {Link} from "react-router-dom";
import React from "react";

const Games = () => {
    const [games, setGames] = React.useState < Array < Game >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    // React.useEffect -> fetches all games when the page
    React.useEffect(() => {
        getGames()
    }, [])

    const getGames = () => {
        axios.get('http://localhost:4941/api/v1/games')
            .then((response) => {
                console.log("API response:", response.data);  // <- add this
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
                    <button type="button">Edit</button>
                    <button type="button">Delete</button>
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
                </table>
            </div>
        )
    }
}

export default Games;
