export default function WaveDivider() {
  return (
    <svg
      viewBox="0 0 240 24"
      className="mx-auto h-5 w-40 text-accent/70"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="wave-path"
        d="M0 12 Q 15 0, 30 12 T 60 12 T 90 12 T 120 12 T 150 12 T 180 12 T 210 12 T 240 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
