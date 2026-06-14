import Link from "next/link";
import { siteConfig } from "@/src/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-[#252525] bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-[#ecb100]">
              MAAN TRAVELS
            </h3>

            <p className="text-sm text-[#8a8a8a]">
              Premium travel solutions including luxury cars,
              tours, airport transfers and corporate travel.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              Services
            </h4>

            <ul className="space-y-2 text-[#8a8a8a]">
              <li>Luxury Cars</li>
              <li>Tempo Traveller</li>
              <li>Airport Transfer</li>
              <li>Wedding Cars</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              Tour Packages
            </h4>

            <ul className="space-y-2 text-[#8a8a8a]">
              <li>Himachal</li>
              <li>Kashmir</li>
              <li>Golden Triangle</li>
              <li>Pilgrimage Tours</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              Contact
            </h4>

            <ul className="space-y-2 text-[#8a8a8a]">
              <li>{siteConfig.contact.phone}</li>
              <li>{siteConfig.contact.email}</li>
              <li>{siteConfig.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#252525] pt-6 text-center text-sm text-[#8a8a8a]">
          © {new Date().getFullYear()} Maan Travels. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}