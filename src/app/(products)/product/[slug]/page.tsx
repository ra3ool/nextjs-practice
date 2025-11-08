import { getMyCart } from '@/actions/cart.actions';
import { getProduct } from '@/actions/product.actions';
import { AddToCart } from '@/components/products/add-to-cart';
import { ProductImages } from '@/components/products/product-images';
import { ProductPrice } from '@/components/products/products-price';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { routes } from '@/constants/routes.constants';
import type { CartType } from '@/types/cart.type';
import { serializePrisma } from '@/utils/serialize-prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const metadata: Metadata = {
  title: 'Product',
};

async function ProductDetails({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const [product, rawCart] = await Promise.all([
    getProduct({ slug }),
    getMyCart(),
  ]);

  if (!product) notFound();

  const cart = serializePrisma(rawCart as CartType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-2">
        <ProductImages images={product.images} />
      </div>

      <div className="col-span-2 flex flex-col gap-4">
        <h3 className="font-bold">{product.name}</h3>
        <p>{product.rate} out of 100 reviews</p>
        {/* TODO add comments count here  */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <ProductPrice
            value={product.price}
            className="rounded-full px-5 py-2 bg-green-100 text-green-700"
          />
        </div>
        <div className="text-sm space-y-1.5">
          <div className="flex gap-1.5">
            <span>Brand:</span>
            <Link href={`${routes.products.brands}/${product.brand.slug}`}>
              <p>{product.brand.name}</p>
            </Link>
          </div>
          <div className="flex gap-1.5">
            <span>Category:</span>
            <Link
              href={`${routes.products.categories}/${product.category.slug}`}
            >
              <p>{product.category.name}</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Description</p>
          <p>{product.description}</p>
        </div>
      </div>

      <div className="col-span-1">
        <Card className="p-4">
          <div className="flex justify-between">
            <span>Price</span>
            <ProductPrice value={product.price} />
          </div>

          <div className="flex justify-between items-center">
            <span>Status</span>
            {product.stock > 0 ? (
              <Badge variant="outline">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out Of Stock</Badge>
            )}
          </div>

          {product.stock > 0 && (
            <AddToCart
              cart={cart}
              item={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                qty: 1,
                stock: product.stock,
                image: product.images[0],
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export { metadata };
export default ProductDetails;
