import { useState } from 'react';
import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Create a new product',
};

export default function ProductCreatePage() {
  const [s, setT] = useState();
  return <ProductCreateView />;
}

export async function generateStaticParams() {
  return [];
}
