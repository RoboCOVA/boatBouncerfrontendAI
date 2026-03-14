import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@radix-ui/react-icons";
import { Fragment } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const bookingTypes = [
  {
    id: 1,
    type: "Active Bookings",
    value: "active",
  },
  {
    id: 2,
    type: "Cancelled Bookings",
    value: "cancelled",
  },
];

const ListBox = ({
  selected,
  setSelected,
}: {
  selected: any;
  setSelected: any;
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-56 cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-custom1 focus:outline-none sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected.type}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 w-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {bookingTypes.map((booking: any) => (
                  <Listbox.Option
                    key={booking.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-cyan-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                      )
                    }
                    value={booking}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate",
                            )}
                          >
                            {booking.type}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-cyan-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default ListBox;
