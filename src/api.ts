// Everything this app knows about the CardCorpus API is in this file.
import { use } from "react";
import type { CardCorpusStaticAPIManifest } from "./types/index";
import type { Catalog, CardCorpusSetsOfACatalog } from "./types/sets";
import type { Card, CardCorpusSet, CardSummary, Variant } from "./types/set";
import type { CardCorpusPainting } from "./types/painting";
import type { CardCorpusPokemon } from "./types/pokemon";
import type { CardCorpusPokemonCards } from "./types/pokemon-cards";
import type { CardCorpusArtists } from "./types/artists";
import type { CardCorpusCharacters } from "./types/characters";
import type { CardCorpusArtist } from "./types/artist";
import type { CardCorpusCharacter } from "./types/character";
import type { CardCorpusVocabulary } from "./types/vocabulary";
import type { CardCorpusPricesOfASet } from "./types/prices";
import type { CardCorpusPriceHistoryOfACard } from "./types/price-history";
import type { CardCorpusPrintedTextOfASet } from "./types/text";
import type { CardCorpusPlay } from "./types/play";

export const API = "https://pokemon.cardcorpus.com/v1";
const PRICES = "https://prices.cardcorpus.com";
const IMAGES = "https://img.cardcorpus.com/s1";

// What each file of the API holds. The types in src/types are generated from
// the JSON Schemas the API publishes: `npm run types`.
interface Files {
  "index.json": CardCorpusStaticAPIManifest;
  "vocabulary.json": CardCorpusVocabulary;
  "pokemon.json": CardCorpusPokemon;
  "artists.json": CardCorpusArtists;
  "characters.json": CardCorpusCharacters;
  [set: `sets/${string}.json`]: CardCorpusSet;
  [painting: `paintings/${string}.json`]: CardCorpusPainting;
  [pokemon: `pokemon-cards/${string}.json`]: CardCorpusPokemonCards;
  [artist: `artists/${string}.json`]: CardCorpusArtist;
  [character: `characters/${string}.json`]: CardCorpusCharacter;
}

// A catalog's sets and one set share an address shape:
// sets/english.json is the list, sets/english/base-set.json a set.
type File<Path extends keyof Files> = Path extends `sets/${Catalog}.json` ? CardCorpusSetsOfACatalog : Files[Path];

// Shorter names for the parts the app passes around.
// CardSummary is a card as every list has it; Card is the whole card, in its set's file.
export type { Card, CardCorpusSet, CardSummary, Variant };
// A set as the lists of sets have it.
export type SetSummary = CardCorpusSetsOfACatalog["sets"][number];
export type CardPointer = { set: string; id: string };

// A set's id is its catalog and its name in it: "english/base-set".
export function parseSetId(set: string) {
  const [catalog, slug] = set.split("/");
  return { catalog, slug };
}

// Fetch a JSON file once and remember it.
// An optional file that isn't there, or doesn't arrive, gives undefined.
const cache = new Map<string, Promise<unknown>>();
function getJson(url: string, optional = false) {
  if (!cache.has(url)) {
    const file = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      return res.json();
    });
    cache.set(url, optional ? file.catch(() => undefined) : file);
  }
  return cache.get(url)!;
}

// The same, for a component. `use` makes React wait for the file,
// showing the nearest <Suspense> fallback until it is here.
function useJson<T>(url: string, optional = false) {
  return use(getJson(url, optional)) as T;
}

// A file of the dataset, typed by its path: useApi("pokemon.json")
export function useApi<Path extends keyof Files>(path: Path) {
  return useJson<File<Path>>(`${API}/${path}`);
}

// A card's painting: every print of its picture, in every language. Each print there
// has its links (the same card in other languages, its reprints and parallels), and
// every card a link names is in the same file. A card that shares its picture with
// no other card has no painting, and no links.
export function usePainting(card: Card) {
  const painting = card.painting;
  return painting ? useApi(`paintings/${painting.id}.json`) : undefined;
}

// A print in a painting's file, by its set and card id: `prints[set][id]`.
export function printIn(painting: CardCorpusPainting, pointer: { set: string; id: string }) {
  return painting.prints[pointer.set]?.[pointer.id];
}

// A card's links, from its print in its painting's file.
export function useLinks(card: Card) {
  const painting = usePainting(card);
  return painting && printIn(painting, card)?.links;
}

// The card a link of `from` names: every one is in the same painting file.
export function useLinkedCard(pointer: CardPointer, from: Card): CardSummary | undefined {
  const painting = usePainting(from);
  return painting && printIn(painting, pointer);
}

// What a card prints, word for word, from its set's text file, text/{set}.json.
// Not every set has one yet, and a set's file leaves out cards not yet read.
export function useCardText(card: Card) {
  const file = useJson<CardCorpusPrintedTextOfASet | undefined>(`${API}/text/${card.set}.json`, true);
  return file?.cards.find((entry) => entry.id === card.id);
}

// The cards that play the same as this one, whatever their picture. Only a card
// in a play of more than one card names one (English cards only, for now).
export function usePlay(card: Card) {
  // `use`, unlike other hooks, may be called conditionally.
  return card.play ? (use(getJson(`${API}/plays/${card.play.id}.json`)) as CardCorpusPlay) : undefined;
}

// An image is an id. Copies are 240, 480 or 960 px wide.
export function imageUrl(id: string, width: 240 | 480 | 960 = 480) {
  return `${IMAGES}/${width}/${id}.avif`;
}

// The words to show for a code: label("finish", "cosmos_holo") is "Cosmos holo".
export function useLabels() {
  const vocabulary = useApi("vocabulary.json");
  return (group: keyof CardCorpusVocabulary, code: string) => vocabulary[group]?.[code]?.label ?? code;
}

// Prices are a second, smaller API on its own host, typed by path the same way:
// usePrices(`${set}.json`) is today's prices of a set,
// usePrices(`history/${set}/${card}.json`) is one card's price on every day.
type PriceFile<Path> = Path extends `history/${string}` ? CardCorpusPriceHistoryOfACard : CardCorpusPricesOfASet;
export function usePrices<Path extends `${string}.json`>(path: Path) {
  return useJson<PriceFile<Path> | undefined>(`${PRICES}/${path}`, true); // not every set has prices
}
