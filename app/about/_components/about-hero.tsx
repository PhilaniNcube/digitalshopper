/**
 * v0 by Vercel.
 * @see https://v0.dev/t/I8sw9sV7rzC
 */
export default function AboutHero() {
  return (
    <>
      <div className="py-6 text-center ">
        <h1 className="text-3xl md:text-5xl font-bold text-black">Our Company</h1>
        <p className="text-xl text-zinc-800 my-2 dark:text-zinc-300 max-w-[600px] px-8 mx-auto">
          Welcome to Digital Shopper, your go-to destination for electronics,
          cosmetics bags and much more. Established in 2023 we have been
          committed to providing high-quality products.
        </p>
      </div>
      <section className="w-full py-12">
        <div className="container grid items-start justify-center gap-6 px-4 text-center md:px-6 lg:grid-cols-3 lg:text-left">
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className=" h-12 w-12 text-zinc-900 dark:text-zinc-100"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 13V2l8 4-8 4" />
                <path d="M20.55 10.23A9 9 0 1 1 8 4.94" />
                <path d="M8 10a5 5 0 1 0 8.9 2.02" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Our Mission
            </h2>
            <p className="mx-auto max-w-[700px] text-zinc-800 md:text-base text-justify dark:text-zinc-400">
              At Digital Shopper our mission is to empower customers with
              top-notch products that enhance their everyday lives. We believe
              in quality, innovation, customer satisfaction, and these
              principles guide every aspect of our business.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className=" h-12 w-12 text-zinc-900 dark:text-zinc-100"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Our Vision
            </h2>
            <p className="mx-auto max-w-[700px] text-zinc-800 md:text-base text-justify dark:text-zinc-400">
              Our vision is to be the go-to destination for individuals seeking
              not just products, but a community that understands and enhances
              their digital lifestyles. At Digital Shopper, we aim to shape the
              future of digital commerce, connecting people through a curated,
              accessible, and sustainable shopping ecosystem."
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className=" h-12 w-12 text-zinc-900 dark:text-zinc-100"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="m21 2-9.6 9.6" />
                <path d="m15.5 7.5 3 3L22 7l-3-3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Our Values
            </h2>
            <p className="mx-auto max-w-[700px] text-zinc-800 md:text-base text-justify dark:text-zinc-400">
              Digital Shopper is more than an e-commerce platform; it's a
              commitment to customer-centric excellence, innovation, and
              transparency. We curate high-quality products, prioritize
              accessibility, and foster a community of empowered digital
              shoppers. Sustainability, continuous improvement, and personalized
              service are at the heart of our values. At Digital Shopper, we're
              passionate about enhancing digital lifestyles and providing a
              secure, seamless, and delightful shopping experience for all.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
