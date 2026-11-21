// Writes src/types from the JSON Schemas the API publishes: `npm run types`.
// index.json lists every file of the API with the schema that describes it.
import { mkdir, writeFile } from "node:fs/promises";
import { compile } from "json-schema-to-typescript";

// API=http://localhost:…/v1 reads a local tree instead, to follow a change before it is live.
const API = process.env.API ?? "https://pokemon.cardcorpus.com/v1";
const index = await fetch(`${API}/index.json`).then((res) => res.json());

await mkdir("src/types", { recursive: true });
// Every file of the dataset, then the price files.
const schemas = [...index.files.map((file) => file.schema), ...Object.values(index.prices.schemas)];
for (const schema of schemas) {
  const name = schema.match(/schema\/(.+)\.schema\.json/)[1];
  const json = await fetch(`${API}/${schema}`).then((res) => res.json());
  const types = await compile(json, name, { additionalProperties: false });
  await writeFile(`src/types/${name}.d.ts`, types);
  console.log(`src/types/${name}.d.ts`);
}
