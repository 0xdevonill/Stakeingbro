import { hashString } from "@/lib/utils";

const palettes = [
  ["#5EEBC1", "#0C1118"],
  ["#7AA2FF", "#0C1118"],
  ["#E8B86D", "#0C1118"],
  ["#9B8CFF", "#0C1118"],
  ["#6EE7F9", "#0C1118"],
  ["#F3A6C5", "#0C1118"],
];

export function TokenLogo({
  symbol,
  size = 40,
  className = "",
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const index = hashString(symbol) % palettes.length;
  const [fg] = palettes[index];
  const letters = symbol.slice(0, 3).toUpperCase();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="12" fill="#121821" />
      <circle cx="20" cy="20" r="13" fill={`${fg}22`} stroke={fg} strokeWidth="1.2" />
      <path d="M13 25.5 18.2 14h3.6L27 25.5h-3.1l-.9-2.2h-6l-.9 2.2H13Zm5.4-4.5h3.2l-1.6-4-1.6 4Z" fill={fg} />
      <text x="20" y="38" textAnchor="middle" fontSize="0" fill="transparent">
        {letters}
      </text>
    </svg>
  );
}
