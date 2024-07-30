import PageHeader from "@/components/PageHeader";

const page = () => {
  return (
    <main>
      <PageHeader title="Privacy Policy" />
      <section className="container py-10">
        <h2 className="text-xl lg:text-2xl font-bold mb-5">
          Personal Information We Collect
        </h2>
        <p className="text-md mb-2">
          When you visit our website, we collect certain information about your
          device, such as your IP address, browser type, and operating system.
          We also collect information about the pages you visit on our website.
        </p>
        <p className="text-md mb-2">
          We collect personal information from you when you:
        </p>{" "}
        <ul className="list-disc list-inside text-md mb-2">
          <li>Create an account</li>
          <li>Place an order</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact us</li>
        </ul>
        <p className="text-md mb-2">
          The personal information we collect includes your name, email address,
          shipping address, billing address, phone number, and payment
          information.
        </p>{" "}
        <h2 className="text-xl lg:text-2xl font-bold my-5">
          How We Use Your Personal Information
        </h2>{" "}
        <p className="text-md mb-2">We use your personal information to:</p>{" "}
        <ul className="list-disc list-inside text-md mb-2">
          <li>Process your orders and deliver your purchases</li>
          <li>
            Communicate with you about your orders, including shipping updates
            and order confirmations
          </li>
          <li>
            Send you marketing emails about our products and services, if you
            have opted in to receive them
          </li>
          <li>Improve our website and marketing efforts</li>
          <li>Provide customer service</li>
        </ul>{" "}
        <h2 className="text-xl lg:text-2xl font-bold my-5">
          Sharing Your Personal Information
        </h2>{" "}
        <p className="text-md mb-2">
          We share your personal information with third-party service providers
          who help us operate our website and deliver our services to you. These
          third-party service providers include:
        </p>{" "}
        <ul className="list-disc list-inside text-md mb-2">
          <li>Shipping companies</li>
          <li>Payment processors</li>
          <li>Email marketing platforms</li>
        </ul>{" "}
        <p className="text-md mb-2">
          We also use Google Analytics to track website traffic. Google
          Analytics collects information about your device, such as your IP
          address, browser type, and operating system. Google Analytics also
          collects information about the pages you visit on our website.
        </p>
        <p className="text-md mb-2">
          We do not sell your personal information to third parties.
        </p>
        <h2 className="text-xl lg:text-2xl font-bold my-5">Your Rights</h2>{" "}
        <p className="text-md mb-2">
          You have the right to access, correct, delete, or restrict the
          processing of your personal information. You also have the right to
          object to the processing of your personal information and to have your
          personal information transferred to another company.
        </p>
        <p className="text-md mb-2">
          To exercise your rights, please contact us at
          info@digitalshopper.co.za
        </p>
        <h2 className="text-xl lg:text-2xl font-bold my-5">Data Retention</h2>{" "}
        <p className="text-md mb-2">
          We will retain your personal information for as long as necessary to
          provide you with our services and to comply with our legal
          obligations.
        </p>
        <h2 className="text-xl lg:text-2xl font-bold my-5">Security</h2>{" "}
        <p className="text-md mb-2">
          We take security measures to protect your personal information,
          including:
        </p>{" "}
        <ul className="list-disc list-inside text-md mb-2">
          <li>Using secure servers</li>
          <li>Encrypting your personal information</li>
          <li>
            Limiting access to your personal information to authorized employees
          </li>
        </ul>{" "}
        <h2 className="text-xl lg:text-2xl font-bold my-5">
          Changes to This Privacy Policy
        </h2>{" "}
        <p className="text-md mb-2">
          We may update this Privacy Policy from time to time. The latest
          version will always be posted on our website.
        </p>
      </section>
    </main>
  );
};
export default page;
