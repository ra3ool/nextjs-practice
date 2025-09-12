import ProductsList from '@/components/products/products-list';

export default function HomePage() {
  return (
    <div>
      <ProductsList title="Newest Arrivals" limit={4} />
    </div>
  );
}
