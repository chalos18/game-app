type Game = {
    gameId: number,
    title: string,
    genreId: number,
    creationDate: string,
    creatorFirstName: string,
    creatorLastName: string,
    creatorId: number,
    price:number,
    rating: number,
    description: string,
    platformIds: number[];
    numberOfWishlists: number;
    numberOfOwners: number;
}

type User = {
    firstName: string,
    lastName: string,
    email: string,
}