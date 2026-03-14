export default function PriceChip({
  price,
  type,
  currency,
  className = "",
}: {
  price: number;
  type: string;
  currency: string | undefined;
  className?: string;
}) {
  return (
    <p
      className={`inline-block w-fit whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-zinc-900 ${className}`}
    >
      <span className="text-sm font-bold lg:text-base">
        {currency ? (currency == "USD" ? "$" : "€") : "$"}
        {price}
      </span>{" "}
      <span className="text-xs font-light">/ {type}</span>
    </p>
  );
}
