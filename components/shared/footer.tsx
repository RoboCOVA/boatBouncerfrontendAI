import Image from "next/image";
// import icon from "../../public/icon.svg";
// import Icon from "./icons/icon";
import logo2 from "public/boatbouncer-favicon.png";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto w-screen bg-slate-800 px-6 pb-6 pt-12 lg:pl-16">
      <div className="mx-auto mb-12 flex flex-col gap-12 text-white md:flex-row md:justify-between md:gap-6">
        <div className="flex max-w-2xl flex-col font-manrope">
          {/* <Icon className="fill-white" /> */}
          <Image
            className="mb-2 rounded-full"
            src={logo2}
            width={35}
            height={35}
            alt=""
          />{" "}
          <p className="mb-3 text-xl font-bold">BOAT BOUNCER</p>
          <p className="text-base font-medium opacity-40">
            Welcome to BoatBouncer, your premier destination for boat rentals
            and water activities! Whether you are looking to explore the open
            waters, enjoy a day out with friends and family, or simply want to
            relax and take in the scenery, we have the perfect options for you.
            So if you&apos;re ready to hit the water and experience and start
            your adventure, come to BoatBouncer. We look forward to providing
            you with a memorable and enjoyable experience that you&apos;ll never
            forget.
          </p>
        </div>
        <div className="ml-0 grid grid-cols-1 md:ml-6 md:mr-6 md:flex md:flex-row md:gap-6 lg:mr-10 2xl:mr-16">
          <div className="flex flex-col gap-5 font-manrope text-base font-medium">
            <p className="mb-3 text-xl font-bold">Company</p>
            <Link href={"/about"}>About Us</Link>
            <Link href={"/contact"}>Contact Us</Link>
            <Link href={"/careers"}>Careers</Link>
            {/* <p>Blog</p> */}
            {/* <p>Pricing</p> */}
          </div>
          {/* <div className="ml-3 flex flex-col gap-5 font-manrope text-base font-medium sm:ml-0 sm:whitespace-nowrap md:ml-0">
            <p className="mb-3 text-xl font-bold">Product</p>
            <p>Invoicing Platform</p>
            <p>Accounting Platform</p>
            <p>Create Proposal</p>
            <p>Contracts</p>
          </div>
          <div className="ml-3 flex flex-col gap-5 font-manrope text-base font-medium sm:ml-0 sm:whitespace-nowrap md:ml-0">
            <p className="mb-3 text-xl font-bold">Resources</p>
            <p>Proposal Template</p>
            <p>Invoice Template</p>
            <p>Tutorial</p>
            <p>How to write a contract</p>
          </div> */}
        </div>
      </div>
      <hr className="my-8 h-px border-0 bg-zinc-700" />
      <div className="flex flex-col justify-around font-manrope text-xs font-extralight text-white md:flex-row">
        <p>
          2022 BoatBouncer. All rights reserved. --{" "}
          <Link href="#">Privacy Policy</Link> -{" "}
          <Link href="">Terms of Services</Link>
        </p>
        {/* <p>
          <span>Supported by</span> <span className="font-bold">Startup</span>
        </p> */}
      </div>
    </footer>
  );
}
