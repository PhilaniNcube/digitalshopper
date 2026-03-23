import type { Database } from "@/schema";
import { Facebook, Home, Instagram, Mail, Phone } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { fetchCategoriesFromDatabase } from "@/utils/fetchers/categories";

const Footer = async () => {

  const categories = await fetchCategoriesFromDatabase();

  return (
    <footer className="bg-black">
      <div className="container py-10">
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-10">
          <div className="flex flex-col items-start justify-center w-full pr-8 lg:pr-16">
            <Link href="/" className="font-bold">
              <Image
                src="/images/logo_square.webp"
                alt="Logo"
                width={400}
                height={400}
                className="object-cover w-24"
              />
            </Link>
            <p className="mt-2 text-sm font-medium md:text-md text-slate-200">
              Digital Shopper is a shop for all your art needs in addition to
              the rest of you online shopping. Shop with us for personalised
              service.
            </p>
            <p className="mt-2 text-sm font-medium md:text-md text-slate-200">
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
              <div className="flex justify-start mt-8 space-x-4">
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
                  <FaTiktok className="text-2xl text-white hover:text-blue-500" />
                </Link>
              </div>
            </div>
            <div className="flex justify-end mt-8 space-x-4"/>
          </div>
          <div className="flex flex-col w-full space-y-3">
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
              className="flex items-center text-sm text-white uppercase gap-x-2 hover:text-slate-300"
              href="mailto:info@digitalshopper.co.za"
            >
              <Mail />
              info@digitalshopper.co.za
            </Link>
            <Link
              target="_blank"
              className="flex items-center text-sm text-white uppercase gap-x-2 hover:text-slate-300"
              href="tel:+27658626070"
            >
              <Phone />
              +27 65 862 6070
            </Link>
            <p className="flex items-center text-sm text-white uppercase gap-x-2 hover:text-slate-300">
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
