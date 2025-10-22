import { ProductsList } from '@/components/products/products-list';

function HomePage() {
  return (
    <div>
      <ProductsList title="Newest Arrivals" limit={4} />
    </div>
  );
}

export default HomePage;
