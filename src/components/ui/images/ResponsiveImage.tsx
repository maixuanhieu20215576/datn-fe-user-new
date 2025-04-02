export default function ResponsiveImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <img
          src={src}
          alt={alt}
          className={`w-full border border-gray-200 rounded-xl dark:border-gray-800 ${className}`}
        />
      </div>
    </div>
  );
}
