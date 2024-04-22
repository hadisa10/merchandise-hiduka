import { _jobs } from 'src/_mock';

import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Create a new product',
};

export default function ProductCreatePage() {
  return <ProductCreateView />;
}

export async function generateStaticParams() {
  return _jobs.map((job) => ({
    id: job.id,
  }));
}
