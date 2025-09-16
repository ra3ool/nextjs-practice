import { getProduct } from '@/actions/product.actions';
import { notFound } from 'next/navigation';

export default async function ProductDetails(props: {
  params: { slug: string };
}) {
  const { slug } = await props.params;
  const product = await getProduct({ slug });
  if (!product) notFound();

  return <>{product.name}</>;
}
