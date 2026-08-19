import { useEffect, useState } from "react";

const SPOTS = [
  { top: "12%", left: "8%", tilt: "-4deg" },
  { top: "14%", right: "10%", tilt: "3deg" },
  { bottom: "24%", left: "10%", tilt: "2deg" },
  { bottom: "16%", right: "12%", tilt: "-3deg" },
  { top: "50%", left: "4%", tilt: "4deg" },
  { top: "48%", right: "5%", tilt: "-2deg" },
];

export default function HiPopup() {
  const [visible, setVisible] = useState(false);
  const [spot, setSpot] = useState(SPOTS[0]);

  useEffect(() => {
    const show = () => {
      setSpot(SPOTS[Math.floor(Math.random() * SPOTS.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const firstShow = setTimeout(show, 1200);
    const interval = setInterval(show, 13000);

    return () => {
      clearTimeout(firstShow);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pop-in comic-bubble fixed z-30 max-w-[210px] px-4 py-3"
      style={{ ...spot, "--tilt": spot.tilt }}
    >
      <p className="font-comic text-xl leading-none tracking-wide text-[#241220]">
        HI!
      </p>
      <p className="font-comicBody text-sm text-[#241220]">
        Dhivagar wants to say hi to you 💌
      </p>
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
