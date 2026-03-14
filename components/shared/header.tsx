import { use, useEffect, useState } from "react";
import avatar from "../../public/empty-profile-picture.png";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import logo from "public/boatbouncer-favicon.png";
import Image from "next/image";
import useFetcher from "@/lib/hooks/use-axios";
import { Menu, MenuIcon } from "lucide-react";

export default function Header(props: any) {
  const { fetchWithAuth, data, loading } = useFetcher();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!session?.token) return;
    if (!isDropdownOpen) return;

    fetchWithAuth("/message/new/count", null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token, isDropdownOpen]);

  return (
    <header className="fixed top-0 z-20 w-full shadow-custom1 backdrop-blur-3xl">
      <nav className="relative flex h-20 items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Link
            href={"/"}
            className="absolute left-0 top-[0.5rem] flex flex-row items-center gap-2"
          >
            <Image
              className={`ml-5 rounded-full ${
                props?.page ? "fill-white" : "fill-cyan-600"
              } md:ml-5`}
              src={logo}
              width={65}
              height={65}
              alt=""
            />
            <p className="font-sans text-2xl font-extrabold text-cyan-600">
              Boatbouncer
            </p>
          </Link>
          {props?.children}
        </div>
        {props?.email || props?.user?.email ? (
          <div className="mr-5 flex flex-row items-center justify-between gap-5">
            <DropdownMenu.Root onOpenChange={(open) => setIsDropdownOpen(open)}>
              <DropdownMenu.Trigger asChild className="border border-gray-200">
                <Image
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 cursor-pointer rounded-full border-2 border-gray-400 text-white"
                  src={props?.profilePicture || avatar}
                />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="DropdownMenuContent !z-30"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="dropdown-header flex flex-row gap-3 py-3 pl-4 pr-8">
                    <Image
                      className="h-10 w-10 rounded-full border-2 border-gray-400 text-white"
                      src={props?.profilePicture || avatar}
                      width="40"
                      height="40"
                      alt=""
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-sm font-medium text-gray-700">
                        {props?.user?.name ||
                          `${props.firstName ?? ""}${
                            props?.lastName ? " " + props?.lastName : ""
                          }` ||
                          props.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {props.user.email}
                      </p>
                    </div>
                  </DropdownMenu.Item>
                  <hr className="mt-1 h-px border-0 bg-gray-200" />
                  <Link href="/user/update">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      Profile
                    </DropdownMenu.Item>
                  </Link>
                  <Link href="/favorites">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      Favorites
                    </DropdownMenu.Item>
                  </Link>
                  <Link href="/bookings">
                    <DropdownMenu.Item className="dropDownItem flex flex-row items-center gap-2 py-3 pl-4 text-sm text-gray-700">
                      Messages
                      {loading ? (
                        <div className="flex size-8 items-center justify-center">
                          <div className="size-8 animate-spin rounded-full border-4 border-gray-300 border-t-cyan-600"></div>
                        </div>
                      ) : data && data?.newMessageCount ? (
                        <div className="flex size-8 flex-row items-center justify-center gap-0.5 rounded-full bg-red-500">
                          <p className="flex items-center justify-center text-center text-base font-semibold text-white">
                            {data.newMessageCount}
                          </p>
                          <p className="font-bold text-white">!</p>
                        </div>
                      ) : (
                        <p className="flex size-8 items-center justify-center rounded-full bg-gray-300 text-center text-base font-semibold">
                          0
                        </p>
                      )}
                    </DropdownMenu.Item>
                  </Link>
                  <Link href="/listings">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      My Listings
                    </DropdownMenu.Item>
                  </Link>
                  <Link href="/bookings">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 font-inter text-sm text-gray-700">
                      My Bookings
                    </DropdownMenu.Item>
                  </Link>
                  <Link href="/listings?mode=create">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 font-inter text-sm text-gray-700">
                      Create Listing
                    </DropdownMenu.Item>
                  </Link>
                  {/* <Link href="/payments">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      Payments
                    </DropdownMenu.Item>
                  </Link> */}
                  <Link href="/history">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      History
                    </DropdownMenu.Item>
                  </Link>
                  <hr className="mt-1 h-px border-0 bg-gray-200" />
                  <button
                    onClick={() => signOut()}
                    className="dropDownItem w-full text-start"
                  >
                    <DropdownMenu.Item className="dropdown-footer py-3 pl-4 text-sm text-gray-700">
                      Sign Out
                    </DropdownMenu.Item>
                  </button>
                  <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        ) : (
          <div className="mr-5 flex flex-row items-center justify-between gap-5">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild className="border border-gray-200">
                <MenuIcon className="size-10 cursor-pointer rounded border border-gray-300 stroke-[1.5px] text-cyan-600" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="DropdownMenuContent !z-30"
                  sideOffset={5}
                >
                  <hr className="mt-1 h-px border-0 bg-gray-200" />

                  <Link href="/user/login">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 font-inter text-sm text-gray-700">
                      Sign in
                    </DropdownMenu.Item>
                  </Link>

                  <Link href="/user/register">
                    <DropdownMenu.Item className="dropDownItem w-40 py-3 pl-4 text-sm text-gray-700">
                      Create Account
                    </DropdownMenu.Item>
                  </Link>

                  <Link href="/user/login?redirect_to=listings?mode=create">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 font-inter text-sm text-gray-700">
                      Create Listing
                    </DropdownMenu.Item>
                  </Link>

                  <Link href="/contact">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      Contact Us
                    </DropdownMenu.Item>
                  </Link>

                  <Link href="/about">
                    <DropdownMenu.Item className="dropDownItem py-3 pl-4 text-sm text-gray-700">
                      About
                    </DropdownMenu.Item>
                  </Link>

                  <hr className="my-0.5 h-px border-0 bg-gray-200" />
                  <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        )}
      </nav>
    </header>
  );
}
