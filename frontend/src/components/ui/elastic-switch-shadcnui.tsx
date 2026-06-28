"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface ElasticSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function ElasticSwitch({
  checked,
  onCheckedChange,
  disabled = false,
}: ElasticSwitchProps = {}) {
  // Internal state used only when uncontrolled (no `checked` prop passed)
  const [internalOn, setInternalOn] = useState(false);

  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internalOn;

  const handleClick = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternalOn(next);
    onCheckedChange?.(next);
  };

  return (
    <div className="flex items-center justify-center p-2">
      <button
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={isOn}
        className={`relative h-7 w-14 rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`h-5 w-5 rounded-full bg-white shadow-md ${isOn ? "ml-auto" : ""}`}
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