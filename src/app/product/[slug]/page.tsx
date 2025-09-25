import { getProduct } from '@/actions/product.actions';
import AddToCart from '@/components/products/add-to-cart';
import ProductImages from '@/components/products/product-images';
import ProductPrice from '@/components/products/products-price';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductDetails(props: {
  params: { slug: string };
}) {
  const { slug } = await props.params;
  const product = await getProduct({ slug });
  if (!product) notFound();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-2">
        <ProductImages images={product.images} />
      </div>
      <div className="col-span-2">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold">{product.name}</h3>
          <p>{product.rate} out of 100 reviews</p>{' '}
          {/* TODO add comments count here  */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <ProductPrice
              value={product.price}
              className="rounded-full px-5 py-2 bg-green-100 text-green-700"
            />
          </div>
          <div className="text-sm">
            <div className="flex gap-1.5">
              <span>Brand: </span>
              <Link href={`/products/brands/${product.brand.slug}`}>
                <p>{product.brand.name}</p>
              </Link>
            </div>
            <div className="flex gap-1.5">
              <span>Category: </span>
              <Link href={`/products/categories/${product.category.slug}`}>
                <p>{product.category.name}</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <Card className="p-4">
          <div className="flex justify-between">
            <span>Price</span>
            <ProductPrice value={product.price} />
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            {product.stock > 0 ? (
              <Badge variant="outline">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out Of Stock</Badge>
            )}
          </div>
          {product.stock > 0 && (
            <AddToCart
              item={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                qty: 1,
                image: product.images[0],
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
