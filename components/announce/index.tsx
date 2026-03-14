import Image from "next/image";
import announceImg from "../../public/announce_pic.jpg";
import { Check } from "lucide-react";

function Announce() {
  return (
    <div className="mx-auto bg-white py-8 pb-4 sm:py-12 sm:pb-6">
      <div className="mx-auto px-12 lg:px-16">
        <div className="mx-auto lg:mx-0">
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-gray-200 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:gap-x-12 2xl:gap-x-24">
            <div className="flex max-w-xl flex-col items-start justify-center">
              <div className="w-18 flex items-center justify-center rounded-full p-3">
                <p className="mb-4 text-5xl font-extrabold">
                  BoatBouncer is the best way to get on the Water
                </p>
              </div>
              <div className="flex  justify-center rounded-full p-3">
                <p className="max-w-md text-left text-lg text-gray-600">
                  Simplify your integration using Stripe Checkout. It
                  dynamically adapts to your customer’s device and location to
                  increase conversion.
                </p>
              </div>
              <div className="mt-6 w-full border-t pt-6">
                <ul>
                  <li className="mb-3 inline-flex">
                    <Check className="mr-1.5 text-cyan-600" /> Upgrade your
                    customer experience instantly
                  </li>
                  <li className="mb-3 inline-flex">
                    <Check className="mr-1.5 text-cyan-600" /> Retain more,
                    happier customers
                  </li>
                  <li className="inline-flex">
                    <Check className="mr-1.5 text-cyan-600" /> Start with
                    done-for-you account setup
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex max-w-xl flex-col items-center justify-between">
              <Image src={announceImg} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announce;
