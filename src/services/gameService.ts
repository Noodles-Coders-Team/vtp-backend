import p from "../lib/prisma";
const prisma = p.prisma;

export async function getAllGames() {
    const allGames = await prisma.game.findMany();
    console.log("All games: ", JSON.stringify(allGames, null, 2));
    return allGames;
}

export async function getGameById(gameId: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    console.log("Game: ", JSON.stringify(game, null, 2));
    return game;
}

export async function createGame(body: any) {
    console.log("Creating game: ", JSON.stringify(body, null, 2));
    const createdGame = await prisma.game.create({
        data: body
    });
    return createdGame;
}

export async function updateGame(id: string, game_body: any) {
    console.log("Updating game with ID: ", id, " with data: ", JSON.stringify(game_body, null, 2));
    const updatedGame = await prisma.game.update({
        where: { id: id },
        data: game_body
    });
    return updatedGame;
}

export async function deleteGame(id: string) {
    console.log("Deleting game with ID: ", id);
    const deletedGame = await prisma.game.delete({
        where: { id: id }
    });
    return deletedGame;
}