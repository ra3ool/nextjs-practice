import { getProducts } from '@/actions/product.actions';
import { ProductCard } from '@/components/products/product-card';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Products list',
};

async function ProductsListPage() {
  const products = await getProducts();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export { metadata };
export default ProductsListPage;
