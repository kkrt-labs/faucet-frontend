import { useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react";
import { Check, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CommandList } from "cmdk";

export const WalletDetails = () => {
  const [open, setOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const wallet = useActiveAccount();
  const disconnectWallet = useActiveWallet();

  const prettyWallet = wallet?.address.slice(0, 5) + "..." + wallet?.address.slice(-3);

  if (!wallet || !disconnectWallet) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          style={{
            borderRadius: "6px",
            background: "linear-gradient(0deg, #5E5E5E 0%, #5E5E5E 100%), rgba(255, 255, 255, 0.40)",
            boxShadow: "0px 1px 2px 0px rgba(164, 172, 185, 0.24), 0px 0px 0px 1px rgba(18, 55, 105, 0.08)",
          }}
          className="space-x-2 font-normal justify-around"
          variant="wallet"
          size="withIcon"
        >
          <Avatar>
            <AvatarImage src={`https://effigy.im/a/${wallet?.address}.png`} />
            <AvatarFallback>{wallet.address}</AvatarFallback>
          </Avatar>
          <span>{prettyWallet}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[155px] -mt-2 p-0 !bg-[#5e5e5e]">
        <Command className="!bg-[#5e5e5e] rounded-t-none">
          <CommandGroup>
            <CommandList>
              <CommandItem
                value="Logout"
                onSelect={(_) => {
                  disconnect(disconnectWallet);
                  setOpen(false);
                }}
                className="flex items-center justify-between !text-white !bg-[#5e5e5e] cursor-pointer"
              >
                Disconnect
                <LogOut className={cn("mr-2 h-4 w-4")} />
              </CommandItem>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
