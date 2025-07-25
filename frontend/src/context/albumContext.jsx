import { createContext, useContext, useState } from "react";

const AlbumContext = createContext();

export function AlbumProvider({ children }) {
  const [albums, setAlbums] = useState(null);
  return (
    <AlbumContext.Provider value={{ albums, setAlbums }}>
      {children}
    </AlbumContext.Provider>
  );
}

export function useAlbumContext() {
  return useContext(AlbumContext);
}
