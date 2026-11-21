# Pokémon card explorer

A small React app that browses every Pokémon card through the CardCorpus API.
It is written to be read: TypeScript with types generated from the API's own schemas, [shadcn/ui](https://ui.shadcn.com)
for the few controls, and no data library. Each file is a screen or so long.

```
npm install
npm run dev        # the app
npm run types      # write src/types again from the API's JSON Schemas
```

## The pages

Each page is one file in `src/pages`, with its route in `src/App.tsx`.

| Page | File | Request |
| --- | --- | --- |
| The sets of a catalog | `SetsPage.tsx` | `index.json`, `sets/{catalog}.json` |
| A set's cards | `SetPage.tsx` | `sets/{catalog}/{slug}.json` |
| A card | `CardPage.tsx` | none: the card is in the set's file |
| A Pokémon's cards | `PokemonPage.tsx` | `pokemon-cards/{catalog}/{dex}.json`, `pokemon.json` |
| An artist's cards | `ArtistPage.tsx` | `artists/{catalog}/{id}.json`, `artists.json` |
| A character's cards | `CharacterPage.tsx` | `characters/{catalog}/{id}.json`, `characters.json` |

`src/api.ts` holds everything the app knows about the API: the base url, how an
image id becomes an image url, and the types of every file.

Loading uses React's `use` and `<Suspense>`: `useApi` returns the file itself,
never a loading state, and React shows the nearest `<Suspense>` fallback until
it is here. There is one around the routes in `src/App.tsx` and one around the
sections on the card page. Beside each is an `<ErrorBoundary>`, which shows a
message in place of anything that fails to load.

## The types

The API publishes a JSON Schema for every file, listed in `index.json`.
`scripts/types.js` turns each into a TypeScript file in `src/types`, and
`src/api.ts` says which file has which type, so `useApi("pokemon.json")` and
`` useApi(`sets/${id}.json`) `` come back typed, with every field documented in
the editor. The price files' types are generated the same way.

## The card page's sections

Below the card's picture, the card page is a list of sections. Each is one
file in `src/sections`, on its own, and one line in `src/pages/CardPage.tsx`:
comment the line out and the section is gone.

| Line | Shows | Reads |
| --- | --- | --- |
| `<Pieces card={card} />` | The halves of a LEGEND or quarters of a V-UNION, put together | `card.pieces` |
| `<People card={card} />` | Links to the card's Pokémon, characters and artist | `card.species`, `card.characters`, `card.artists` |
| `<Variants card={card} />` | Every version of the card: 1st Edition, reverse holo, stamped promos | `card.variants` |
| `<Prices card={card} />` | Today's price of each variant | `prices.cardcorpus.com/{set}.json` |
| `<PriceHistory card={card} />` | A chart of its price each day | `prices.cardcorpus.com/history/{set}/{card}.json` |
| `<Languages card={card} />` | The same card in other languages | `card.links.counterparts` |
| `<Reprints card={card} />` | The same card printed again later, and what changed | `card.links.reprints`, `card.links.reprintOf` |
| `<Painting card={card} />` | Every print of the picture, grouped by the card it is on | `card.links.painting`, `paintings/{set}.json` |

Good cards to try: `/sets/english/base-set/4` (Charizard: seven variants,
eight reprints) and `/sets/english/evolutions/11` (a different card with
the same picture).

## About

This is an example app for the [CardCorpus](https://cardcorpus.com) API, an
open dataset of Pokémon TCG cards in English, Japanese and Chinese.

- The data: [cardcorpus/pokemon-card-dataset](https://github.com/cardcorpus/pokemon-card-dataset)
  (the same files the app fetches, browsable and downloadable in one zip)
- The live API: [pokemon.cardcorpus.com/v1/index.json](https://pokemon.cardcorpus.com/v1/index.json)
- Recognizing cards in photos: [cardcorpus/pokemon-card-scanner](https://github.com/cardcorpus/pokemon-card-scanner)

## Licence

The code is under the [MIT License](LICENSE): copy it, change it, build on
it. The data it fetches is under CC BY 4.0. See [NOTICE](NOTICE) for the
trademarks and copyrights of others that neither licence covers.
