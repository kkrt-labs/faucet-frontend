import { FC, PropsWithChildren } from "react";
import background from "@/public/assets/background.svg";

export const BaseContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="flex flex-col justify-center bg-white w-full py-11 md:h-96 rounded-md my-12 sm:my-16"
      style={{
        backgroundImage: `url("/assets/background.svg")`,
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "100% 100%",
      }}
    >
      {children}
    </div>
  );
};
