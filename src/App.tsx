import { Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import SetsPage from "./pages/SetsPage";
import SetPage from "./pages/SetPage";
import CardPage from "./pages/CardPage";
import PokemonPage from "./pages/PokemonPage";
import ArtistPage from "./pages/ArtistPage";
import CharacterPage from "./pages/CharacterPage";

export default function App() {
  return (
    <BrowserRouter>
      <header className="border-b px-6 py-3">
        <Link to="/" className="font-semibold">Card browser</Link>
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <ErrorBoundary>
          <Suspense fallback={<p>Loading…</p>}>
            <Routes>
              <Route path="/" element={<SetsPage />} />
              <Route path="/sets/:catalog/:slug" element={<SetPage />} />
              <Route path="/sets/:catalog/:slug/:card" element={<CardPage />} />
              <Route path="/pokemon/:dex" element={<PokemonPage />} />
              <Route path="/artists/:artist" element={<ArtistPage />} />
              <Route path="/characters/:character" element={<CharacterPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </BrowserRouter>
  );
}
