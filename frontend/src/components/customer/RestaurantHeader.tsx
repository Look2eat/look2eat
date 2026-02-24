interface RestaurantHeaderProps {
    name: string;
    logoUrl: string;
    bonusPoints:number;
    bonus:boolean
  }
  
  export default function RestaurantHeader({
    name,
    logoUrl,
    bonus=false,
    bonusPoints=40
  }: RestaurantHeaderProps) {
    return (
      <div className="relative -mt-6 bg-white rounded-t-4xl  px-5  pt-12">
        
        {/* Logo (overlapping banner) */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-full  border-white shadow-lg overflow-hidden bg-white">
            <img
              src={logoUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
    
        {/* Content */}
        <div className="flex flex-col items-center text-center">
          
          {/* Restaurant Name */}
          <h1 className="text-2xl font-bold text-black">
            {name}
          </h1>
    
          {/* Rewards Badge */}
          {bonus && (
            <div className="mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
              🎉 Share your details and get{" "}
              <span className="text-purple-500 font-bold">
                {bonusPoints} bonus points
              </span>
            </div>
          )}
    
        </div>
      </div>
    );
  }    