/* Re-mountet bei jedem Routenwechsel → weicher Seiten-Übergang */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
