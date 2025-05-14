import { create } from 'zustand';

interface GameState {
    games: Game[];
    setGames: (games: Array<Game>) => void;
    // editGame: (game: Game, newTitle: string) => void;
    removeGame: (game: Game) => void;
}

const useStore = create<GameState>((set) => ({
    games: [],
    setGames: (games: Array<Game>) => set(() => {
        return { games: games }
    }),
    // editGame: (game: Game, newTitle) => set((state) => {
    //     return {
    //         games: state.games.map(g => g.game_id === game.gameId ?
    //             ({ ...g, title: newTitle } as Game) : g)
    //     }
    // }),
    removeGame: (game: Game) => set((state) => {
        return {
            games: state.games.filter(g => g.gameId !==
                game.gameId)
        }
    })
}))
export const useGameStore = useStore;
