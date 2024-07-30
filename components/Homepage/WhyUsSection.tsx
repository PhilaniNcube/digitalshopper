import Image from "next/image";

const WhyUsSection = () => {
  return (
    <section>
      <div className="container py-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
          <div className="w-full pr-8 lg:pr-16 flex flex-col justify-center items-start">
            <h2 className="text-2xl uppercase md:text-3xl font-bold text-black mb-5">
              a Personalized Shopping Experience Second to None
            </h2>
            <p className="text-sm md:text-md tracking-wide text-slate-800 font-medium">
              Say goodbye to the days of being treated like just another
              customer. As a boutique business with a small team we give
              personal attention to all our clients. We go the extra mile to
              collect products that you will love at reasonable prices. We are
              always available to answer any questions you may have and we are
              always open to suggestions on how we can improve your shopping
              experience.
            </p>
          </div>
          <div className="w-full ">
            <Image
              src="/images/shopping.jpg"
              width={1920}
              height={1280}
              alt="Shopping"
              className="w-full object-cover aspect-auto lg:aspect-video"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default WhyUsSection;
