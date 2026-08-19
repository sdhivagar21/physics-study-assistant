import { useEffect, useState } from "react";

const CORNERS = [
  { top: "18%", left: "6%", tilt: "-3deg" },
  { top: "20%", right: "6%", tilt: "3deg" },
  { bottom: "18%", left: "8%", tilt: "2deg" },
  { bottom: "20%", right: "8%", tilt: "-4deg" },
  { top: "45%", right: "4%", tilt: "4deg" },
];

export default function ChocolatePopup() {
  const [visible, setVisible] = useState(false);
  const [spot, setSpot] = useState(CORNERS[0]);

  useEffect(() => {
    const show = () => {
      setSpot(CORNERS[Math.floor(Math.random() * CORNERS.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    };

    const firstShow = setTimeout(show, 5000);
    const interval = setInterval(show, 19000);

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
        SWEET!
      </p>
      <p className="font-comicBody text-sm text-[#241220]">
        Dhivagar wants to buy chocolate for you Kiruthiga 🍫
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
