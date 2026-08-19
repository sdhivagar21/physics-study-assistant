import WaveDivider from "./WaveDivider.jsx";

export default function Greeting({ name }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        HII {name}
      </h1>
      <WaveDivider />
      <p className="max-w-sm text-sm text-muted">
        Upload your notes or textbook chapters, then ask anything about them —
        or any physics question at all. 💕
      </p>
    </div>
  );
}
