import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface BaseContainerProps {
  className?: string;
}

export const BaseContainer: FC<PropsWithChildren<BaseContainerProps>> = ({ children, className }) => {
  return (
    <div
      className={cn("flex flex-col justify-center bg-white w-full py-11 md:h-96 rounded-md my-12 sm:my-16", className)}
      style={{
        backgroundImage: `url("/assets/background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {children}
    </div>
  );
};
