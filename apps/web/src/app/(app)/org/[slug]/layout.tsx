import { Header } from "@/components/header";
import { Tabs } from "@/components/Tabs";

export default async function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-6">
      <Header />
      <Tabs />

      <main className="mx-auto w-full max-w-[1200px] py-4 px-1">
        {children}
      </main>
    </div>
  );
}
