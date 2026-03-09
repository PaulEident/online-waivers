import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400 border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/volntir-icon.png" alt="" width={22} height={22} className="opacity-80" />
              <span className="font-bold text-white text-base tracking-tight">Volntir</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Free digital waiver management for events and organizations.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/how-to-use" className="hover:text-white transition-colors">How to Use</Link></li>
              <li><Link href="/our-story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/suggest" className="hover:text-white transition-colors">Suggest a Feature</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Volntir. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Volunteering, Together
          </p>
        </div>
      </div>
    </footer>
  );
}
