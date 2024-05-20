import { useActiveAccount } from "thirdweb/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseContainer } from "@/components/base-container";
import { TextPair } from "@/components/text-pair";
import { useState } from "react";

export const InviteCodeSplash = ({ setIsWhitelisted }: { setIsWhitelisted: () => void }) => {
  const wallet = useActiveAccount();
  const prettyWallet = wallet?.address.slice(0, 6) + "..." + wallet?.address.slice(-4);

  const [inviteCode, setInviteCode] = useState("");
  const [isWrongCode, setIsWrongCode] = useState(false);
  return (
    <BaseContainer>
      <div className="flex flex-col justify-center items-center">
        <TextPair heading="Enter Invite Code" description="Enter the code in the input field" />
        <Input
          type="text"
          placeholder="Enter your code here"
          className="py-6 placeholder:text-xs placeholder:text-[#878794] mt-6 md:mt-12 placeholder:font-normal"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <Button
          variant={isWrongCode ? "fail" : "main"}
          className="w-full mt-4 md:mt-8"
          onClick={() => {
            if (inviteCode === "KKRT") {
              setIsWhitelisted();
            } else {
              setIsWrongCode(true);
            }
          }}
        >
          {isWrongCode ? "Invalid Code" : "Verify"}
        </Button>
        <Button className="w-full space-x-6 items-center text-[#878794] mt-6" variant="outline">
          <div className="flex space-x-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{prettyWallet}</span>
          </div>
          <span className="text-[#F54400] text-xs">Change Wallet</span>
        </Button>
      </div>
    </BaseContainer>
  );
};
