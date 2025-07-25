import React, { useRef } from "react";
import Album from "../components/album";

function Browse({ genre, list }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="p-8 dark:text-white">
      <h2 className="text-xl font-bold mb-2">{genre}</h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
        >
          ◀
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
        >
          ▶
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hidden px-10 scroll-smooth"
        >
          <div className="flex gap-6 w-fit py-4">
            {list.map((album, index) => (
              <div key={index} className="shrink-0 w-[320px]">
                <Album album={album} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Browse;
