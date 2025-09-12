import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductPrice from './products-price';

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="flex flex-col overflow-hidden duration-300 hover:shadow-xl">
      <CardHeader className="p-4 flex items-center justify-center">
        <Link
          href={`products/${product.id}`}
          className="flex justify-center items-center h-48 w-full"
        >
          <Image
            src={product.image}
            alt={product.title}
            width={192}
            height={192}
            priority={true}
            className="object-contain h-full w-auto max-w-full"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        <Link href={`categories/${product.category}`}>
          <p className="text-sm text-blue-600 hover:text-blue-800 font-medium capitalize">
            {product.category}
          </p>
        </Link>
        <Link href={`products/${product.id}`}>
          <h6 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h6>
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">
              <StarIcon size={16} />
            </span>
            <p>
              {product.rating?.rate}{' '}
              <span className="text-gray-500">({product.rating?.count})</span>
            </p>
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
