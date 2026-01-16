import { Game } from "./components/game";

export default function Home() {
  return (
    <div className="grid sm:items-center bg-gray-950 text-gray-50 justify-items-center font-sans">
      <main className="p-0 py-4 sm:p-6 sm:pb-2 w-auto touch-none flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My 2048 Game</h1>
        <Game />
      </main>
    </div>
  );
}
