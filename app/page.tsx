import { Game } from "./components/game";

export default function Home() {
  return (
    <div className="grid sm:items-center bg-gray-950 text-gray-50 justify-items-center p-0 py-4 md:p-6 md:pb-2 font-[family-name:var(--font-geist-sans)]">
      <main className="p-2 sm:p-6 w-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My 2048 Game</h1>
        <Game />
      </main>
    </div>
  );
}
