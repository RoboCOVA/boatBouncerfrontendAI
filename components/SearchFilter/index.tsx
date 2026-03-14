import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";

const Index = ({
  trigger,
  children,
}: {
  trigger?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Content className="absolute left-0 mr-[0px] h-[calc(100vh_-_140px)] w-[99.5vw] overflow-y-scroll rounded-lg bg-white p-2.5 px-5 shadow-custom3 [-ms-overflow-y-style:'none'] [scrollbar-width:'none'] sm:px-10 lg:w-[29.75vw] lg:px-2.5 [&::-webkit-scrollbar]:hidden">
        {children}
      </Popover.Content>
    </Popover.Root>
  );
};

export default Index;
