import { create } from 'zustand';

interface GameState {
    games: Game[];
    game: Game | null;
    setGames: (games: Array<Game>) => void;
    setGame: (game: Game) => void;
    removeGame: (game: Game) => void;
    // editGame: (game: Game, newTitle: string) => void;
}

const getLocalStorage = (key: string): Game[] =>
    JSON.parse(window.localStorage.getItem(key) as string) || [];

const setLocalStorage = (key: string, value: Game[]) =>
    window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<GameState>((set) => ({
    games: getLocalStorage('games') || [],
    game: null,

    setGames: (games: Array<Game>) => set(() => {
        setLocalStorage('games', games)
            return {games: games}
    }),
    setGame: (game: Game) => set(() => ({
        game
    })),
    // editGame: (game: Game, newTitle) => set((state) => {
    //     const temp = state.games.map(u => g.gameId === game.gameId ?
    //         ({...g, title: newTitle} as Game): g)
    //     setLocalStorage('games', temp)
    //     return {games: temp}
    // }),
    removeGame: (game: Game) => set((state) => {
        setLocalStorage('games', state.games.filter(u => u.gameId !==
            game.gameId))
        return {games: state.games.filter(u => u.gameId !==
                game.gameId)}
        })
}))

export const useGameStore = useStore;
