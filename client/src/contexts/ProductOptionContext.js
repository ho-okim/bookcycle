import { createContext, useContext } from "react";

const ProductOptionContext = createContext();

export function useProductOption() {
    return useContext(ProductOptionContext);
}

export default ProductOptionContext;