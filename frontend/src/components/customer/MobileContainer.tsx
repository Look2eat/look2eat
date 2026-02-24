interface Props {
    children: React.ReactNode;
  }
  
  export default function MobileContainer({ children }: Props) {
    return (
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-105 min-h-screen bg-white shadow-xl ">
          {children}
        </div>
      </div>
    );
  }
  