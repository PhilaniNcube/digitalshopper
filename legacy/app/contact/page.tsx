import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us | Digital Shopper",
  description:
    "Digital Shopper for a personalised online shopping experience. Shop for your favourite products and get them delivered to your doorstep. As a small team we give each of our customers the best experience possible.",
  alternates: {
    canonical: "https://www.digitalshopper.co.za",
  },
};

const page = () => {
  return (
    <main className="container py-10 text-center">
      <h1 className="text-2xl md:text-5xl font-extrabold text-center">
        Contact Us
      </h1>
      <p className="mt-6 text-md lg:text-lg tracking-wide max-w-[70ch] mx-auto">
        Our friendly and knowledgeable customer support team is available to
        assist you with any queries. We strive to respond to all inquiries
        within 24 hours (except on weekends and holidays when our response time
        may be slightly longer).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 mt-8">
        <div className="flex flex-col items-center justify-center space-y-2 p-10 border border-zinc-100 rounded-md shadow">
          <h2 className="text-xl font-bold">Email</h2>
          <a
            className="text-md text-blue-500 hover:text-blue-600"
            href="mailto:info@digitalshopper.co.za"
          >
            info@digitalshopper.co.za
          </a>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2 p-10 border border-zinc-100 rounded-md shadow">
          <h2 className="text-xl font-bold">Phone</h2>
          <a
            className="text-md text-blue-500 hover:text-blue-600"
            href="tel:+27659446989"
          >
            +27659446989
          </a>
        </div>
      </div>
    </main>
  );
};
export default page;
