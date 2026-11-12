export function ProductImage({ src, name, className = "" }: { src?: string | null; name: string; className?: string }) {
  return <div className={`relative flex items-center justify-center overflow-hidden bg-[#edf0e8] ${className}`}>
    {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8f0df] via-[#f5f2e8] to-[#dce9df]"><span className="absolute -left-10 -top-14 h-44 w-44 rounded-full bg-lime/40 blur-2xl"/><span className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-forest/10 blur-2xl"/><span className="relative text-5xl font-black text-forest/20">س</span></div>}
  </div>;
}
