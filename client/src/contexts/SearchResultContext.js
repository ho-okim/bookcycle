import { createContext, useContext } from "react";

const SearchResultContext = createContext();

export function useSearchResult() {
    return useContext(SearchResultContext);
}

export default SearchResultContext;