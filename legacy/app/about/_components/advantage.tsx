/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cBlPacLOKxO
 */
export default function Advantage() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Sets Us Apart
            </h2>
            <h4 className="text-lg mt-5 mb-2">Our Drop Shipping Advantage</h4>
            <p className="max-w-[600px] text-zinc-700 text-sm">
              Unlike traditional retail, we operate on a dropshipping model.
              What does this mean for you? It means we source and curate a
              diverse selection of products from around the world, and they are
              shipped directly from our suppliers to your doorstep. This allows
              us to offer you an unparalleled variety without the cost and
              complexity of traditional inventory management.
            </p>

            <h4 className="text-lg mt-8 mb-2">Quality Without Compromise</h4>
            <p className="max-w-[600px] text-zinc-700 text-sm">
              We understand the importance of quality in the products you bring
              into your life. That's why we collaborate with reputable suppliers
              who share our commitment to excellence. Every item in our store
              undergoes a thorough vetting process to ensure it meets our
              standards of quality and durability.
            </p>

            <h4 className="text-lg mt-8 mb-2">
              Your Satisfaction, Our Priority
            </h4>
            <p className="max-w-[600px] text-zinc-700 text-sm">
              At digital shopper customer satisfaction is our top priority. We
              strive to provide a seamless shopping experience, from the moment
              you browse our site to the timely delivery of your order. Our
              customer support team is here to assist you with any questions or
              concerns you may have.
            </p>

            <h4 className="text-lg mt-8 mb-2">Explore Your Lifestyle</h4>
            <p className="max-w-[600px] text-zinc-700 text-sm">
              Discover a curated collection of products that enhance your
              lifestyle. Whether you're looking for the latest tech gadgets,
              stylish home decor, or trendy accessories, we've got you covered.
              Our team is passionate about staying on top of the latest trends
              to bring you products that complement your unique taste.
            </p>

            <h4 className="text-lg mt-8 mb-2">Trust in Transparency</h4>
            <p className="max-w-[600px] text-zinc-700 text-sm">
              We believe in transparency throughout your shopping experience.
              From product sourcing to shipping details, we want you to feel
              informed and confident in every purchase. Our commitment to
              transparency extends to our pricing – fair and competitive, with
              no hidden fees.
            </p>
          </div>
          <img
            alt="Placeholder"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            height="310"
            src="/images/shopping.jpg"
            width="550"
          />
        </div>
      </div>
    </section>
  );
}
