export default function Button4({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[13px] text-white/80 select-none transition-colors hover:text-white"
    >
      {children}
    </span>
  );
}
