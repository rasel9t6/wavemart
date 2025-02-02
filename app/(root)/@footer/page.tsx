import Image from 'next/image';

export default function FooterPage() {
  return (
    <footer className=" bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6">
        <Image
          src="/bd-ship-mart-logo.svg"
          alt="BD SHIPMART"
          width={150}
          height={40}
          className="mx-auto"
        />
        <div className="grid grid-cols-4 gap-8">
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
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Shipping Information</li>
              <li>Returns & Exchanges</li>
              <li>FAQ</li>
              <li>Track Your Order</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Connect With Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@bdshipmart.com</li>
              <li>Phone: +880 123-456-7890</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BD SHIPMART. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
