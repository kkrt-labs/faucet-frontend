import { FC, PropsWithChildren } from "react";

export const CarrotContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col justify-center items-center my-16">
    <div className="w-full sm:w-fit text-center flex flex-col justify-center items-center">{children}</div>
  </div>
);
