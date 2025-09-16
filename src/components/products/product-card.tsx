import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProductWithRelations } from '@/types';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductPrice from './products-price';

function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Card className="flex flex-col overflow-hidden duration-300 hover:shadow-xl">
      <CardHeader className="p-4 flex items-center justify-center">
        <Link
          href={`products/${product.slug}`}
          className="flex justify-center items-center h-48 w-full relative"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100px, 192px"
            priority={true}
            className="object-contain"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        <Link href={`products/${product.slug}`}>
          <h6 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h6>
        </Link>
        <div className="flex items-center justify-between flex-wrap">
          <Link href={`brands/${product.brand.slug}`}>
            <p className="text-sm text-blue-600 hover:text-blue-800 font-medium capitalize">
              {product.brand.name}
            </p>
          </Link>
          <Link href={`categories/${product.category.slug}`}>
            <p className="text-sm text-blue-600 hover:text-blue-800 font-medium capitalize">
              {product.category.name}
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
          <ProductPrice
            value={product.price}
            className="font-bold text-green-700"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
