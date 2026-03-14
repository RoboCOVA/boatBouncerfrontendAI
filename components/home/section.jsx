import {
  BarChart2,
  Command,
  Mail,
  MessageCircle,
  Smile,
  Zap,
} from "lucide-react";

function Feature() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto px-6 lg:px-8">
        <div className="mx-auto lg:mx-0">
          <div className="flex flex-col justify-start px-8">
            <div className="flex flex-col items-center justify-start space-y-5">
              <div className="flex flex-col items-center justify-start space-y-3">
                <p className="text-center text-base font-semibold leading-normal text-cyan-600">
                  Features
                </p>
                <p className="text-center text-4xl font-semibold leading-10 text-gray-900">
                  How it works
                </p>
              </div>
              <p className="max-w-3xl text-center text-xl leading-loose text-gray-500">
                Powerful, self-serve product and growth analytics to help you
                convert, engage, and retain more users. Trusted by over 4,000
                startups.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center space-x-2 ">
            <div className="flex items-center justify-center rounded-md bg-gray-50 px-3 py-2">
              <p className="text-sm font-medium leading-tight text-cyan-600">
                Renter
              </p>
            </div>
            <div className="flex items-center justify-center rounded-md px-3 py-2">
              <p className="text-sm font-medium leading-tight text-gray-500">
                Owner
              </p>
            </div>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex max-w-xl flex-col items-center justify-between">
              <div className="h-18 w-18 flex items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100 p-3">
                <Mail className="text-cyan-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-start space-y-2">
                <p className="w-full text-center text-xl font-medium leading-loose text-gray-900">
                  Share team inboxes
                </p>
                <p className="w-full text-center text-base leading-normal text-gray-500">
                  Whether you have a team of 2 or 200, our shared team inboxes
                  keep everyone on the same page and in the loop.
                </p>
              </div>
            </div>
            <div className="flex max-w-xl flex-col items-center justify-between">
              <div className="h-18 w-18 flex items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100 p-3">
                <Zap className="text-cyan-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-start space-y-2">
                <p className="w-full text-center text-xl font-medium leading-loose text-gray-900">
                  Deliver instant answers
                </p>
                <p className="w-full text-center text-base leading-normal text-gray-500">
                  An all-in-one customer service platform that helps you balance
                  everything your customers need to be happy.
                </p>
              </div>
            </div>
            <div className="flex max-w-xl flex-col items-center justify-between">
              <div className="h-18 w-18 flex items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100 p-3">
                <BarChart2 className="text-cyan-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-start space-y-2">
                <p className="w-full text-center text-xl font-medium leading-loose text-gray-900">
                  Manage your team with reports
                </p>
                <p className="w-full text-center text-base leading-normal text-gray-500">
                  Measure what matters with Untitled’s easy-to-use reports. You
                  can filter, export, and drilldown on the data in a couple
                  clicks.
                </p>
              </div>
            </div>
            <div className="flex max-w-xl flex-col items-center justify-between">
              <div className="h-18 w-18 flex items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100 p-3">
                <Smile className="text-cyan-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-start space-y-2">
                <p className="w-full text-center text-xl font-medium leading-loose text-gray-900">
                  Connect with customers
                </p>
                <p className="w-full text-center text-base leading-normal text-gray-500">
                  Solve a problem or close a sale in real-time with chat. If no
                  one is available, customers are seamlessly routed to email
                  without confusion.
                </p>
              </div>
            </div>
            <div className="flex max-w-xl flex-col items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100 p-3">
                <Command className="text-cyan-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-start space-y-2">
                <p className="w-full text-center text-xl font-medium leading-loose text-gray-900">
                  Connect the tools you already use
                </p>
                <p className="w-full text-center text-base leading-normal text-gray-500">
                  Explore 100+ integrations that make your day-to-day workflow
                  more efficient and familiar. Plus, our extensive developer
                  tools.
                </p>
              </div>
            </div>
            <div className="flex max-w-xl flex-col items-center justify-between">
              <div className="h-18 w-18 flex items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100 p-3">
                <MessageCircle className="text-cyan-600" />
              </div>
              <div className="flex w-full flex-col items-center justify-start space-y-2">
                <p
                  className="leading <loose w-full text-center text-xl
              font-medium text-gray-900"
                >
                  Our people make the difference
                </p>
                <p className="w-full text-center text-base leading-normal text-gray-500">
                  We’re an extension of your customer service team, and all of
                  our resources are free. Chat to our friendly team 24/7 when
                  you need help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
