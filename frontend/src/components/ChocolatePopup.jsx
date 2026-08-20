import { useEffect, useState } from "react";

// Only edges/corners — kept away from the center so it never covers the
// chat or the input box while studying.
const SPOTS = [
  { top: "18%", left: "6%", tilt: "-3deg" },
  { top: "20%", right: "6%", tilt: "3deg" },
  { bottom: "18%", left: "8%", tilt: "2deg" },
  { bottom: "20%", right: "8%", tilt: "-4deg" },
  { top: "50%", right: "4%", tilt: "4deg" },
  { top: "48%", left: "4%", tilt: "-2deg" },
];

// Little memories, shown one at a time, in random order.
const MEMORIES = [
  {
    title: "SWEET!",
    body: "Dhivagar wants to buy chocolate for you Kiruthiga 🍫",
  },
  {
    title: "AW...",
    body: "When Dhivagar visited your home with John, you told him you didn't like Dhivagar. Dhivagar felt so sad 🥺💔",
  },
  {
    title: "YAY!",
    body: "You called him on his birthday that made Dhivagar so happy 🥹💗",
  },
  {
    title: "THANK YOU!",
    body: "Dhivagar wants to say thank you for the pen you gave him 🖊️😊",
  },
  {
    title: "HBD!",
    body: "Dhivagar was SO happy when you first messaged him \"HBD\" on his birthday 🎂🥳",
  },
  {
    title: "NERVOUS!",
    body: "Dhivagar was so nervous asking for your number in front of the bus... but once you gave it, he was the happiest 😳➡️😁",
  },
];

export default function ChocolatePopup() {
  const [visible, setVisible] = useState(false);
  const [spot, setSpot] = useState(SPOTS[0]);
  const [memory, setMemory] = useState(MEMORIES[0]);

  useEffect(() => {
    const show = () => {
      setSpot(SPOTS[Math.floor(Math.random() * SPOTS.length)]);
      setMemory(MEMORIES[Math.floor(Math.random() * MEMORIES.length)]);
      setVisible(true);
      // Auto-closes on its own after a few seconds — never needs to be
      // dismissed, and never sits around long enough to get in the way.
      setTimeout(() => setVisible(false), 6000);
    };

    const firstShow = setTimeout(show, 5000);
    const interval = setInterval(show, 20000);

    return () => {
      clearTimeout(firstShow);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pop-in comic-bubble fixed z-30 max-w-[220px] px-4 py-3"
      style={{ ...spot, "--tilt": spot.tilt }}
    >
      <p className="font-comic text-lg leading-none tracking-wide text-[#241220]">
        {memory.title}
      </p>
      <p className="font-comicBody text-sm text-[#241220]">{memory.body}</p>
      <button
        onClick={() => setVisible(false)}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#241220] bg-white text-xs font-bold text-[#241220]"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
