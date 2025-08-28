import { useEffect, useState } from "react";

export function DisablePreviewMode() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window === window.parent && !window.opener);
  }, []);

  return show ? (
    <a 
      href="/api/preview-mode/disable"
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-600 transition-colors z-50"
    >
      Disable Preview Mode
    </a>
  ) : null;
}
