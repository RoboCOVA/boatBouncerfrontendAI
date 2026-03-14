import Meta from "@/components/layout/meta";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import pubImg from "public/boat-bouncer.png";

export default function AboutPage(props: any) {
  const [selectedTab, setSelectedTab] = useState("renters");

  return (
    <div className="mt-20 flex min-h-screen flex-col">
      <Meta title="About Us" />

      <Header {...(props || {})} />
      <section className="w-full flex-grow bg-gray-100 text-center text-gray-900">
        <div className="relative">
          <Image
            src={pubImg}
            alt="BoatBouncer"
            className="h-[50vh] object-cover lg:w-screen"
          />
          <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50 text-white">
            <h3 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to BoatBouncer!
            </h3>
            <p className="absolute bottom-5 mx-auto max-w-2xl px-4 text-base leading-relaxed sm:text-lg md:text-xl lg:text-2xl">
              Our mission is to make boating accessible, enjoyable, and
              hassle-free for both boat owners and renters.
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex w-full flex-col bg-white p-6 px-4 py-8 sm:px-10 lg:px-14 xl:px-20 2xl:px-28">
          <div className="mb-10 rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <h3 className="mb-8 text-2xl font-bold text-cyan-600">
              Who We Are
            </h3>
            <p className="text-adjustment mx-auto mb-2.5 text-justify text-lg leading-relaxed">
              BoatBouncer is a premier marketplace platform that connects boat
              renters with boat owners. We believe in creating a seamless
              experience that allows you to explore the open waters, relax with
              friends and family, or embark on thrilling water adventures. Our
              platform is designed to simplify the process of renting a boat,
              making it easy and convenient for both parties.
            </p>
          </div>

          <div className="flex flex-col items-end justify-between gap-10 text-lg md:flex-row">
            <div className="w-full ">
              <div className="mb-6 border-b border-gray-300">
                <button
                  className={`px-4 py-2 font-bold transition-all duration-300 ${
                    selectedTab === "renters"
                      ? "border-b-2 border-cyan-600 text-cyan-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedTab("renters")}
                >
                  For Renters
                </button>
                <button
                  className={`ml-4 px-4 py-2 font-bold transition-all duration-300 ${
                    selectedTab === "owners"
                      ? "border-b-2 border-blue-600 text-cyan-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedTab("owners")}
                >
                  For Owners
                </button>
              </div>

              <div className="relative flex w-full flex-col rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                {selectedTab === "renters" && (
                  <div>
                    <ul className="text-adjustment space-y-4 text-justify">
                      <li>
                        <strong className="text-cyan-600">
                          Wide Selection:
                        </strong>{" "}
                        Discover a diverse range of boats, from sailboats and
                        yachts to fishing boats and speedboats.
                      </li>
                      <li>
                        <strong className="text-cyan-600">Easy Booking:</strong>{" "}
                        Our intuitive search and filter options make it simple
                        to find the perfect boat for your needs.
                      </li>
                      <li>
                        <strong className="text-cyan-600">
                          Direct Connection:
                        </strong>{" "}
                        Communicate directly with boat owners to ensure all your
                        questions are answered and your requirements are met.
                      </li>
                    </ul>
                  </div>
                )}

                {selectedTab === "owners" && (
                  <div>
                    <ul className="space-y-4 text-justify">
                      <li>
                        <strong className="text-cyan-600">
                          List Your Boat:
                        </strong>{" "}
                        Easily create listings and showcase your boat to a wide
                        audience of potential renters.
                      </li>
                      <li>
                        <strong className="text-cyan-600">
                          Create Offers:
                        </strong>{" "}
                        Customize offers and promotions to attract more renters.
                      </li>
                      <li>
                        <strong className="text-cyan-600">
                          Confirm Bookings:
                        </strong>{" "}
                        Manage and confirm bookings effortlessly through our
                        platform.
                      </li>
                      <li>
                        <strong className="text-cyan-600">Earn Income:</strong>{" "}
                        Turn your boat into a source of income by sharing it
                        with others who appreciate the boating lifestyle.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="relative flex w-full flex-col rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <h3 className="mb-4 text-xl font-semibold text-cyan-600">
                  Our Commitment
                </h3>
                <p className="text-justify leading-relaxed">
                  At BoatBouncer, we are committed to providing exceptional
                  service and ensuring the highest standards of safety and
                  quality. We strive to build a trusted community where boat
                  owners and renters can connect and enjoy the beauty of the
                  water together. Our team is dedicated to making every boating
                  experience smooth, enjoyable, and memorable.
                  <br />
                  <br />
                </p>
              </div>
            </div>
          </div>
          <strong className="mx-2.5 mb-2 mt-7 text-xl text-cyan-600">
            Thank you for choosing BoatBouncer – where your boating adventure
            begins!
          </strong>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export async function getServerSideProps({
  req,
}: {
  req: IncomingMessage | undefined;
}) {
  const session = await getSession({ req });

  return {
    props: {
      ...session,
    },
  };
}
