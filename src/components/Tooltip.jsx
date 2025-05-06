import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";

const Tooltip = ({ text, targetRef }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
  }, [targetRef]);

  if (!position) return null;

  return createPortal(
    <div
      className="fixed  left-full top-1/2 -translate-y-1/2 ml-3 
                 bg-white text-black px-3 py-1 rounded-md shadow-lg 
                 whitespace-nowrap text-base 
                 opacity-0 group-hover:opacity-100 
                 transition-opacity duration-500 z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>,
    document.body
  );
};

export default Tooltip;
