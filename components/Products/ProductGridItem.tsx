import { Database } from "@/schema";
import Link from "next/link";
import Image from "next/image";
import formatter from "@/lib/currency";

type ProductItemProps = {
  product: Database["public"]["Tables"]["products"]["Row"];
};

const ProductGridItem = ({ product }: ProductItemProps) => {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="w-full cursor-pointer"
      key={product.id}
    >
      <Image
        src={product.images?.at(0)!}
        alt={product.title}
        width={700}
        height={700}
        className="object-cover w-full aspect-square"
      />
      <div className="mt-3">
        <h2 className="text-sm font-semibold text-slate-800 line-clamp-2"> 
          {product.title}
        </h2>
        <p className="text-lg font-medium tracking-wide line-clamp-2" suppressHydrationWarning>
          {formatter(product.price)}
        </p>
      </div>
    </Link>
  );
};
export default ProductGridItem;
