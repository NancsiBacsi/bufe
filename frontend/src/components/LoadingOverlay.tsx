import { useEffect, useState } from "react";

interface Props {
  loading: boolean;
  delay?: number;
}
export default function LoadingOverlay({loading, delay=500}:Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      timer = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [loading, delay]);

  return visible ? (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 border-[6px] border-gray-300 border-t-sky-400 rounded-full animate-spin"></div>
        <span className="text-white text-lg font-medium">Betöltés...</span>
      </div>
    </div>
  ) : null;
}

