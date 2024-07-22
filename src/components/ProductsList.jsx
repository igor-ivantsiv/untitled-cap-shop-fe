import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { SimpleGrid, Skeleton } from "@mantine/core";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("fetching products...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/varients`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        console.log(data);

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }}>
        {products.length > 0 ? (
          <>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                image={product.imageUrl}
                name={product.productId.name}
                price={product.price}
                productId={product._id}
              />
            ))}
          </>
        ) : (
          <>
            {Array.from({length: 10}).map((_, index) => (
                <div key={index} style={{width: "100%", height: "100%"}}><Skeleton height={200} width="100%" /></div>
            ))}
          </>
        )}
      </SimpleGrid>
    </>
  );
};

export default ProductsList;
