/** ChemQuote beaker logo mark. */
export function BrandMark({ size = 30 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" fill="none">
      <path d="M19 5h10M22 5v12L10 37a5 5 0 0 0 4.3 7h20a5 5 0 0 0 4.3-7L26 17V5" stroke="#dceaff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 34c8-7 14 2 20-4l4 8c1 3-1 6-5 6H14c-4 0-6-3-4-6z" fill="#13bfd0" />
      <path d="m26 32 5 5 10-12" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30" cy="12" r="2" fill="#13bfd0" />
      <circle cx="35" cy="6" r="2" fill="#36a3ff" />
    </svg>
  );
}
