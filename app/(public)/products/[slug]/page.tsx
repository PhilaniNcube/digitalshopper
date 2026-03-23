import ProductDetails from "@/components/products/product-details";

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return <ProductDetails searchParamsPromise={params} />;
};

export default ProductPage;
