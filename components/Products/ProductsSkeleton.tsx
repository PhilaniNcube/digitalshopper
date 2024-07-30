const ProductsSkeleton = () => {

  const products = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products?.map((product, index) => (
          <div className="w-full" key={index}>
            <div
              className="w-full object-cover bg-slate-400 animate-pulse aspect-square"
            />
            <div className="mt-3 w-full">
              <div className="text-lg h-4 font-semibold bg-slate-300 rounded w-full line-clamp-1">

              </div>
              <div className="line-clamp-2 h-2 w-1/2 mt-3 bg-slate-200 text-sm tracking-wide">

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductsSkeleton;
