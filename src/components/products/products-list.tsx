import { getProducts } from '@/actions/product.actions';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { routes } from '@/constants/routes.constants';
import Link from 'next/link';

async function ProductsList({
  title,
  limit,
}: {
  title?: string;
  limit?: number;
}) {
  const products = await getProducts(limit);

  if (products.length === 0) return <h3>No products found</h3>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl mb-4">{title}</h2>
        <Button asChild variant="outline" className="text-md">
          <Link href={routes.products.root}>All products</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>
    </>
  );
}

export { ProductsList };
