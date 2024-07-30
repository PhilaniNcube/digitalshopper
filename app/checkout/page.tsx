import BackButton from "@/components/BackButton";
import CheckoutForm from "./CheckoutForm";
import analytics from "@/lib/utils";

const page = async () => {

  analytics.track("begin_checkout")

  return (
    <main>
      <section className="container py-10">
        <div>
          <BackButton />
        </div>
        <CheckoutForm />
      </section>
    </main>
  );
};
export default page;
