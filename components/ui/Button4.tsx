export default function Button4({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center gap-1.5 text-[12px] text-white/90 select-none transition-opacity hover:opacity-70"
      style={{
        fontFamily: 'var(--font-britney)',
        backgroundImage: "url('/images/Button4.png')",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        paddingInline: '1.5rem',
        paddingBlock: '0',
        height: '36px',
        minWidth: '110px',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        lineHeight: '1',
      }}
    >
      {children}
    </span>
  );
}
