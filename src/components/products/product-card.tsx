import { ImageWithLoader } from '@/components/image-with-loader';
import { ProductPrice } from '@/components/products/products-price';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/constants/routes.constants';
import type { ProductWithRelations } from '@/types/product.type';
import { StarIcon } from 'lucide-react';
import Link from 'next/link';

function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Card className="flex flex-col overflow-hidden duration-300 hover:shadow-xl">
      <CardHeader className="p-4 flex items-center justify-center">
        <Link
          href={`${routes.products.single}/${product.slug}`}
          className="flex justify-center items-center h-48 w-full relative"
        >
          <ImageWithLoader
            src={product.images?.[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 192px"
            priority={true}
            className="object-contain"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2 h-full">
        <Link
          href={`${routes.products.single}/${product.slug}`}
          className="grow"
        >
          <h6 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h6>
        </Link>
        <div className="flex items-center justify-between flex-wrap">
          <Link href={`${routes.products.brands}/${product.brand?.slug}`}>
            <p className="text-sm text-blue-600 hover:text-blue-800 font-medium capitalize">
              {product.brand?.name}
            </p>
          </Link>
          <Link
            href={`${routes.products.categories}/${product.category?.slug}`}
          >
            <p className="text-sm text-blue-600 hover:text-blue-800 font-medium capitalize">
              {product.category?.name}
            </p>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">
              <StarIcon size={16} />
            </span>
            <p>{product.rate}</p>
          </div>
          {product.stock > 0 ? (
            <ProductPrice
              value={product.price}
              className="font-bold text-green-700"
            />
          ) : (
            <Badge variant="destructive">Out Of Stock</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { ProductCard };
