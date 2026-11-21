import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { usePrices, type Card } from "../api";
import Section from "../components/Section";

// A card's price on every day we have. One file per card:
// history.days is the list of days, history.copies[variant].tcgplayer the price on each.
export default function PriceHistory({ card }: { card: Card }) {
  const history = usePrices(`history/${card.set}/${card.id}.json`);
  if (!history) return null;

  // Only the variants TCGplayer prices
  const variants = card.variants.filter((variant) => history.copies[variant.id]?.tcgplayer);

  // One row per day: { day: "2026-11-13", "unlimited-holo": 412.5, … }
  const rows = history.days.map((day, i) => {
    const row: Record<string, string | number | null> = { day };
    for (const variant of variants) row[variant.id] = history.copies[variant.id].tcgplayer![i];
    return row;
  });

  const config: ChartConfig = {};
  variants.forEach((variant, i) => {
    config[variant.id] = { label: variant.name, color: `var(--chart-${(i % 5) + 1})` };
  });

  return (
    <Section title="Price history" hint={`prices.cardcorpus.com/history/${card.set}/${card.id}.json`}>
      <ChartContainer config={config} className="h-72 w-full">
        <LineChart data={rows}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" minTickGap={60} />
          <YAxis width={50} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {variants.map((variant) => (
            <Line key={variant.id} dataKey={variant.id} stroke={`var(--color-${variant.id})`} dot={false} connectNulls />
          ))}
        </LineChart>
      </ChartContainer>
    </Section>
  );
}
