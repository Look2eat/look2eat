interface Props {
  children: React.ReactNode;
}

export default function MobileContainer({ children }: Props) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div
        id="mobile-container"
        className="relative w-full max-w-105 min-h-screen bg-white shadow-xl overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}