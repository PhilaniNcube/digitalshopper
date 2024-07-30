const PageHeader = ({ title }: { title: string }) => {
  return (
    <header className="bg-black">
      <div className="container py-10 lg:py-24 flex justify-center items-center">
        <h1 className="text-white text-2xl lg:text-4xl text-center uppercase font-bold">
          {title}
        </h1>
      </div>
    </header>
  );
};
export default PageHeader;
