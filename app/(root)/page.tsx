import Collections from "@/components/Collections";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Image
        src="/banner.png"
        width={2000}
        height={1000}
        alt="banner"
        className="w-screen"
      />
      <Collections />
    </main>
  );
}
