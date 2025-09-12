import { products } from '@/db/products';

function ProductsList({ title, limit }: { title?: string; limit?: number }) {
  const limitedProducts = limit ? products.slice(0, limit) : products;

  if (limitedProducts.length === 0) return <h3>No products found</h3>;

  return (
    <>
      <h2 className="mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {limitedProducts.map((product) => {
          return <div>{product.title}</div>;
        })}
      </div>
    </>
  );
}

export default ProductsList;
