import { useEffect, useMemo, useRef, useState } from "react";

const BottomSheet = () => {
  const [position, setPosition] = useState(0);
  const sheetRef = useRef(null);

  const heights = useMemo(
    () => ({
      closed: 70,
      half: window.innerHeight / 2,
      full: window.innerHeight - 150,
    }),
    []
  );

  const handleDrag = (event) => {
    const start = event.clientY || event.touches[0].clientY;
    const sheet = sheetRef.current;
    const initialTop = sheet.style.top
      ? parseInt(sheet.style.top, 10)
      : window.innerHeight - heights.closed;

    const onMove = (moveEvent) => {
      const current = moveEvent.clientY || moveEvent.touches[0].clientY;
      const diff = start - current;
      const newTop = Math.min(
        Math.max(initialTop - diff, window.innerHeight - heights.full),
        window.innerHeight - heights.closed
      );

      sheet.style.top = `${newTop}px`;
    };

    const onRelease = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onRelease);
      document.removeEventListener("touchend", onRelease);

      const finalTop = parseInt(sheet.style.top, 10);
      const snap =
        finalTop < window.innerHeight - (heights.half + heights.full) / 2
          ? 2
          : finalTop < window.innerHeight - (heights.closed + heights.half) / 2
          ? 1
          : 0;

      setPosition(snap);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("mouseup", onRelease);
    document.addEventListener("touchend", onRelease);
  };

  useEffect(() => {
    const sheet = sheetRef.current;
    const snapPoints = [heights.closed, heights.half, heights.full];
    sheet.style.transition = "top 0.3s ease-in-out";
    sheet.style.top = `${window.innerHeight - snapPoints[position]}px`;
  }, [position, heights]);

  return (
    <div
      className="bottom-sheet user-select-none"
      ref={sheetRef}
      onMouseDown={handleDrag}
      onTouchStart={handleDrag}
    >
      <div className="handle"></div>
      <h2>Bottom Sheet Content</h2>
      <div className="content">
        <button onClick={() => setPosition(2)}>Fully Open</button>
        <button onClick={() => setPosition(1)}>Half Open</button>
        <button onClick={() => setPosition(0)}>Close</button>
      </div>
    </div>
  );
};

export default BottomSheet;
