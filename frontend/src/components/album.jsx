import React from "react";

function Album({ name, img }) {
  return (
    <div className="w-[800px] h-[400px] rounded-lg bg-transparent hover:bg-black hover:bg-opacity-70 transition duration-300 flex flex-col text-white p-4 shadow-md border border-white/10">
      <img
        src={img}
        alt={name}
        className="w-48 h-48 object-cover rounded mb-4 self-start"
      />
      <h2 className="text-lg font-semibold text-left">{name}</h2>
    </div>
  );
}

export default Album;
