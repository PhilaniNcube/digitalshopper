import BackButton from "@/components/BackButton";
import CheckoutForm from "./CheckoutForm";


const page = async () => {



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
