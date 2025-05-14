import { create } from 'zustand';

interface GameState {
    games: Game[];
    setGames: (games: Array<Game>) => void;
    // editGame: (game: Game, newTitle: string) => void;
    removeGame: (game: Game) => void;
}

const getLocalStorage = (key: string): Array<Game> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:Array<Game>) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<GameState>((set) => ({
    games: getLocalStorage('games') || [],
    setGames: (games: Array<Game>) => set(() => {
    setLocalStorage('games', games)
        return {games: games}
    }),
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
