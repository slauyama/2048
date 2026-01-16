"use client";

import { useEffect, useRef, useState } from "react";

function Slot({ digit, textClasses }: { digit: number; textClasses: string }) {
  const digitRef = useRef<HTMLDivElement>(null);
  const [slotSize, setSlotSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (digitRef.current) {
      setSlotSize({
        height: digitRef.current.scrollHeight,
        width: digitRef.current.scrollWidth,
      });
    }
  }, [digit]);

  return (
    <div
      className="overflow-hidden"
      style={{
        width: `${slotSize.width}px`,
        height: `${slotSize.height}px`,
      }}
    >
      <div
        className="transition-transform duration-400 text-center"
        style={{
          transform: `translateY(-${digit * slotSize.height}px)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          return (
            <div
              ref={num === digit ? digitRef : null}
              key={num}
              className={`${textClasses}`}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SlotsText({
  number,
  textClasses,
}: {
  number: number;
  textClasses: string;
}) {
  const string = number.toString();

  return (
    <div className="flex">
      {Array.from(string).map((character, index) => {
        return (
          <Slot
            key={index}
            digit={Number(character)}
            textClasses={textClasses}
          />
        );
      })}
    </div>
  );
}
