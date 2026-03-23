import PageHeader from "@/components/PageHeader";

const page = () => {
  return (
    <main>
      <PageHeader title="Returns" />
      <section className="container py-10">
        <h2 className="text-xl lg:text-2xl font-bold mb-5">Returns Policy</h2>
        <p className="text-md mb-2">
          We want you to be happy with your purchase, so we offer a 7-day return
          policy. You can return any item for a full refund, minus any shipping
          costs.
        </p>
        <p className="text-md mb-2">
          Items must be returned in new and unused condition, with all original
          tags and packaging. We cannot accept returns for items that have been
          damaged, worn, or altered.
        </p>
        <p className="text-md mb-2">
          We will process your refund within 10 business days of receiving the
          returned item.
        </p>
        <p className="text-md mb-2">
          Here are some exceptions to our return policy:
        </p>
        <ul className="list-disc list-inside text-md mb-2">
          <li>
            We do not accept returns for custom orders or items that have been
            personalized.
          </li>
          <li>We do not accept returns for items that are final sale.</li>
          <li>
            We do not accept returns for items that have been damaged in
            transit.
          </li>
        </ul>{" "}
        <p className="text-md mb-2">
          If you have any questions about our return policy, please contact us.
        </p>
      </section>
    </main>
  );
};
export default page;
