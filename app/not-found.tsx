import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TextPair } from "@/components/text-pair";
import image404 from "@/public/assets/404.svg";

export default function FourOFour() {
  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <Image src={image404} alt="404" className="mb-16 mt-10" />
      <TextPair
        heading="Need more testnet ETH?"
        description="Contact us on Discord in the support channel if you need large amount of testnet ETH."
      />
      <Button className="space-x-2 max-w-[120px] mt-6" variant="outline" size="withIcon">
        <span>Reach Out</span>
        <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
      </Button>
    </main>
  );
}
