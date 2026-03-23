const Loading = () => {
  const products = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="w-full lg:w-[200px] h-[40px] lg:h-[500px] bg-slate-200 rounded"/>
      <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {products?.map((product, index) => (
          <div className="w-full" key={index}>
            <div className="object-cover w-full bg-slate-200 animate-pulse aspect-square" />
            <div className="w-full mt-3">
              <div className="w-full h-4 text-lg font-semibold rounded bg-slate-300 line-clamp-1"></div>
              <div className="w-1/2 h-2 mt-3 text-sm tracking-wide line-clamp-2 bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Loading;
