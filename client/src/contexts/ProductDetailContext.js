import { createContext, useContext } from "react";

const ProductDetailContext = createContext();

export function useProductDetail() {
    return useContext(ProductDetailContext);
}

export default ProductDetailContext;