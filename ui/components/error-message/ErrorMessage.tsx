import { useEffect, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

interface Props {
  message: string;
  duration?: number;
  styles?: string;
}

const FADE_OUT_MS = 400;

export const ErrorMessage = ({
  message,
  duration = 5000,
  styles = "",
}: Props) => {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => setLeaving(true), duration);
    return () => clearTimeout(hideTimer);
  }, [duration]);

  useEffect(() => {
    if (!leaving) return;
    const unmountTimer = setTimeout(() => setVisible(false), FADE_OUT_MS);
    return () => clearTimeout(unmountTimer);
  }, [leaving]);

  if (!visible) return null;

  return (
    <div
      className={`flex ${styles} w-full items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 shadow-sm ${leaving ? "fade-out" : "fade-in"}`}
    >
      <IoAlertCircleOutline
        size={18}
        className="mt-0.5 shrink-0 text-red-600"
      />
      <p className="min-w-0 flex-1 break-words text-sm font-semibold text-red-700">
        {message}
      </p>
    </div>
  );
};
