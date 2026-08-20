// A soft, scattered photo collage behind the whole app — the "personal
// bedroom wall" effect. Photos are spread across the whole screen (not just
// the corners) and kept clearly visible.
const PHOTOS = [
  { src: "/photos/memory-1.jpg", style: { top: "3%", left: "4%", width: "170px", height: "215px", transform: "rotate(-9deg)" } },
  { src: "/photos/memory-3.jpg", style: { top: "5%", right: "6%", width: "160px", height: "200px", transform: "rotate(8deg)" } },
  { src: "/photos/memory-5.jpg", style: { top: "58%", left: "3%", width: "165px", height: "205px", transform: "rotate(6deg)" } },
  { src: "/photos/memory-4.jpg", style: { bottom: "4%", right: "6%", width: "180px", height: "220px", transform: "rotate(-7deg)" } },
  { src: "/photos/memory-2.jpg", style: { top: "34%", right: "2%", width: "140px", height: "175px", transform: "rotate(-5deg)" } },
  { src: "/photos/memory-5.jpg", style: { top: "20%", left: "38%", width: "120px", height: "150px", transform: "rotate(4deg)" } },
  { src: "/photos/memory-1.jpg", style: { bottom: "8%", left: "30%", width: "130px", height: "165px", transform: "rotate(-3deg)" } },
  { src: "/photos/memory-3.jpg", style: { bottom: "30%", left: "12%", width: "115px", height: "145px", transform: "rotate(9deg)" } },
  { src: "/photos/memory-2.jpg", style: { top: "68%", right: "16%", width: "135px", height: "170px", transform: "rotate(5deg)" } },
  { src: "/photos/memory-4.jpg", style: { top: "2%", left: "42%", width: "110px", height: "140px", transform: "rotate(-6deg)" } },
];

export default function PhotoScatter() {
  return (
    <div className="photo-scatter">
      {PHOTOS.map((p, i) => (
        <img key={i} src={p.src} style={p.style} alt="" />
      ))}

      {/* Light pink wash — kept subtle so the photos stay clearly visible,
          just enough tint to keep chat text readable in the center. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,243,246,0.35) 0%, rgba(255,225,236,0.55) 55%, rgba(255,208,224,0.65) 100%)",
        }}
      />
    </div>
  );
}
