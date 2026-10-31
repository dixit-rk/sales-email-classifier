/** Decorative animated beaker and glow shapes behind the login hero. */
export function ChemScene() {
  return (
    <div className="chem-scene" aria-hidden="true">
      <div className="chem-orb chem-orb-a" />
      <div className="chem-orb chem-orb-b" />
      <svg className="chem-beaker" viewBox="0 0 300 390" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="liquid" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#28d7d1" stopOpacity=".68" />
            <stop offset="1" stopColor="#5d7df5" stopOpacity=".38" />
          </linearGradient>
        </defs>
        <path d="M112 35h76M125 35v114L51 304c-11 24 2 45 28 45h142c26 0 39-21 28-45l-74-155V35" stroke="#b9e8f9" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M83 268c38-25 80 23 135-3l28 57c6 13-3 25-19 25H73c-15 0-24-13-18-26z" fill="url(#liquid)" />
        <path d="M84 268c38-25 80 23 135-3" stroke="#7cece2" strokeWidth="4" />
        <circle cx="125" cy="291" r="7" fill="#b7fff1" />
        <circle cx="187" cy="311" r="5" fill="#b7fff1" />
        <circle className="bubble b1" cx="147" cy="248" r="7" fill="#a2f5f0" />
        <circle className="bubble b2" cx="172" cy="224" r="4" fill="#a2f5f0" />
        <circle className="bubble b3" cx="122" cy="198" r="5" fill="#a2f5f0" />
      </svg>
    </div>
  );
}
