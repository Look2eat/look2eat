import { motion } from "framer-motion";
import { useState } from "react";

export function ElasticSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="flex items-center justify-center p-2">
      <button
        onClick={() => setIsOn(!isOn)}
        className={`relative h-7 w-14 rounded-full p-1 transition-colors ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          className={`h-5 w-5 rounded-full bg-white shadow-md ${isOn ? "ml-auto" : ""
            }`}
        />
      </button>
      {isOn ? (
        <span className="ml-4 text-green-600 font-bold">Active</span>
      ) : (
        <span className="ml-4 text-gray-500 font-bold">Inactive</span>
      )}
    </div>
  );
}
