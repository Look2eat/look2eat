interface HeroBannerProps {
    imageUrl: string;
  }
  
  export default function HeroBanner({ imageUrl }: HeroBannerProps) {
    return (
      <div className="relative w-full h-50 md:h-48">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
  
        {/* Optional dark overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    );
  }
  
