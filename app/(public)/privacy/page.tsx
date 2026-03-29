import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
	title: "Privacy Policy | Digital Shopper",
	description: "Learn how Digital Shopper collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl text-white mx-auto min-h-[50vh]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-white mt-2">
            How we collect, use, and protect your personal data.
          </p>
        </div>
        <Separator />
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p className="text-sm text-white leading-relaxed">
              We collect personal information you provide when creating an account, placing an order, or contacting support. This may include your name, email address, shipping address, and payment information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            <p className="text-sm text-white leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-white leading-relaxed">
              <li>Process and fulfill your orders.</li>
              <li>Communicate with you about your account and purchases.</li>
              <li>Provide customer support.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Cookies & Analytics</h2>
            <p className="text-sm text-white leading-relaxed">
              We use cookies to enhance your browsing experience, personalize content, and analyze our traffic. 
              By using our website, you consent to our use of cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Data Protection</h2>
            <p className="text-sm text-white leading-relaxed">
              We implement security measures to protect your personal information. We do not sell or rent your personal data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-sm text-white leading-relaxed">
              If you have any questions about this Privacy Policy, please contact our support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
