interface RedeemBannerProps {
  points: number;
}

export default function RedeemBanner({ points }: RedeemBannerProps) {
  if (points < 0) return null;

  return (
    <div className="mx-4 mt-6 rounded-3xl  py-8 px-6 text-center">
      <p className="text-xl font-semibold text-gray-800">
        Get Any Item Worth Up To
      </p>

      <h2 className="mt-3 text-5xl font-extrabold leading-none">
        ₹{points}{" "}
        <span className="text-pink-500">
          for Free
        </span>
      </h2>
    </div>
  );
}