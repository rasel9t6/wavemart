import Image from 'next/image';

export default function FooterPage() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/bd-ship-mart-logo.svg"
            alt="BD SHIPMART"
            width={150}
            height={40}
            className="mx-auto"
          />
        </div>

        {/* Footer Links */}
        <div className="mt-8 grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:text-left">
          <div>
            <h3 className="mb-4 text-xl font-bold">About BD SHIPMART</h3>
            <p className="text-gray-400">
              Your trusted global logistics and shopping partner, bringing the
              world closer to you.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#">Shipping Information</a>
              </li>
              <li>
                <a href="#">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Track Your Order</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Connect With Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                Email:{' '}
                <a href="mailto:bdshipmart@gmail.com">bdshipmart@gmail.com</a>
              </li>
              <li>
                Phone: <a href="tel:+8801234567890">+880 123-456-7890</a>
              </li>
              <li>
                Address: Road 01/B, House 08, Nikunja-2, <br />
                Khilkhet, Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BD SHIPMART. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
