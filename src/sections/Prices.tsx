import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePrices, type Card } from "../api";
import Section from "../components/Section";

// Today's prices. One file per set, keyed by card id, then variant id:
// prices.cards["4"]["unlimited-holo"].tcgplayer.price
export default function Prices({ card }: { card: Card }) {
  const prices = usePrices(`${card.set}.json`);
  const byVariant = prices?.cards[card.id];
  if (!byVariant) return null;

  return (
    <Section title="Prices" hint={`prices.cardcorpus.com/${card.set}.json`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variant</TableHead>
            <TableHead>TCGplayer ({prices.tcgplayer?.currency})</TableHead>
            <TableHead>Cardmarket ({prices.cardmarket?.currency})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {card.variants
            .filter((variant) => byVariant[variant.id])
            .map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.name}</TableCell>
                <TableCell>{byVariant[variant.id].tcgplayer?.price ?? "–"}</TableCell>
                <TableCell>{byVariant[variant.id].cardmarket?.price ?? "–"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Section>
  );
}
