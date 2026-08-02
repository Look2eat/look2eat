interface RedeemBannerProps {
  points: number;
}

export default function RedeemBanner({ points }: RedeemBannerProps) {
  if (points <= 0) return null;

  return (
    <div className="mx-4 mt-4 rounded-3xl  py-12 px-6 text-center">
      <p className="text-xl font-semibold text-gray-800">
        Get Any Item Worth Up To
      </p>

      <h2 className="mt-3 text-4xl font-extrabold leading-none text-black">
        ₹{points}{" "} for
        <span className="text-pink-500 ">
          Free
        </span>
      </h2>
    </div>
  );
}