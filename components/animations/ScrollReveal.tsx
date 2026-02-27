export default function ScrollReveal({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}
