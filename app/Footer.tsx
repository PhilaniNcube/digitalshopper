import { Database } from "@/schema";
import { Facebook, Home, Instagram, Mail, Phone } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

const Footer = ({
  categories,
}: {
  categories: Database["public"]["Tables"]["categories"]["Row"][];
}) => {
  return (
    <footer className="bg-black">
      <div className="container py-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10">
          <div className="w-full pr-8 lg:pr-16 flex flex-col justify-center items-start">
            <Link href="/" className="font-bold">
              <Image
                src="/images/logo_square.webp"
                alt="Logo"
                width={400}
                height={400}
                className="w-24 object-cover"
              />
            </Link>
            <p className="mt-2 text-sm md:text-md font-medium text-slate-200">
              Digital Shopper is a shop for all your art needs in addition to
              the rest of you online shopping. Shop with us for personalised
              service.
            </p>
            <p className="mt-2 text-sm md:text-md font-medium text-slate-200">
              Copyright {new Date().getFullYear()}. All rights reserved
            </p>
          </div>
          <div className="w-full">
            <div className="flex flex-col justify-end space-y-3 text-sm font-medium text-white">
              {categories.map((link) => (
                <Link
                  href={`/categories/${link.slug}`}
                  key={link.id}
                  className="text-sm uppercase hover:text-slate-300"
                >
                  {link.title}
                </Link>
              ))}
              <div className="mt-8 flex justify-start space-x-4">
                <Link
                  href="https://www.facebook.com/digitalshopperza/"
                  target="_blank"
                >
                  <Facebook
                    className="text-white hover:text-blue-500"
                    size={24}
                  />
                </Link>
                <Link
                  href="https://www.instagram.com/digitalshoppersa/"
                  target="_blank"
                >
                  <Instagram
                    className="text-white hover:text-blue-500"
                    size={24}
                  />
                </Link>
                <Link
                  href="https://www.tiktok.com/@digitalshoppersa"
                  target="_blank"
                >
                  <FaTiktok className="text-white text-2xl hover:text-blue-500" />
                </Link>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4"></div>
          </div>
          <div className="w-full flex flex-col space-y-3">
            <Link
              href="/about"
              className="text-sm text-white uppercase hover:text-slate-300"
            >
              About
            </Link>
            <Link
              href="/returns"
              className="text-sm text-white uppercase hover:text-slate-300"
            >
              Returns
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-white uppercase hover:text-slate-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white uppercase hover:text-slate-300"
            >
              Contact Us
            </Link>
            <Link
              target="_blank"
              className="text-sm flex items-center gap-x-2 text-white uppercase hover:text-slate-300"
              href="mailto:info@digitalshopper.co.za"
            >
              <Mail />
              info@digitalshopper.co.za
            </Link>
            <Link
              target="_blank"
              className="text-sm flex items-center gap-x-2 text-white uppercase hover:text-slate-300"
              href="tel:+27658626070"
            >
              <Phone />
              +27 65 862 6070
            </Link>
            <p className="text-sm flex items-center gap-x-2 text-white uppercase hover:text-slate-300">
              <Home />
              22 Silwood Road, Bramley, Johannesburg
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
