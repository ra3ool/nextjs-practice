import ProductCard from '@/components/products/product-card';
import { products } from '@/db/products';

function ProductsList({ title, limit }: { title?: string; limit?: number }) {
  const limitedProducts = limit ? products.slice(0, limit) : products;

  if (limitedProducts.length === 0) return <h3>No products found</h3>;

  return (
    <>
      <h2 className="font-bold text-2xl mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {limitedProducts.map((product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>
    </>
  );
}

export default ProductsList;
