'use client';

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-[#f59e0b]/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[#dc2626]/10 blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-[#d97706]/10 blur-3xl animate-float-slow" />
    </div>
  );
}
