interface SplitLayoutProps {
    left: React.ReactNode;
    right: React.ReactNode;
  }
  
  export default function SplitLayout({ left, right }: SplitLayoutProps) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Half */}
        <div className="bg-white flex justify-center items-start p-8 pt-16">
          <div className="w-full md:w-[70%] min-w-[280px]">
            {left}
          </div>
        </div>
  
        {/* Right Half */}
        <div className="bg-[#fbfbfb] flex justify-center items-start p-8 pt-16">
          <div className="w-full md:w-[70%] min-w-[280px]">
            {right}
          </div>
        </div>
  
      </div>
    );
  }
  