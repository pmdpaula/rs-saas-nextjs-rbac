import { Header } from "@/components/header";

const Home = async () => {
  return (
    <div className="py-4 space-y-4">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] px-1">
        <p className="text-sm text-muted-foreground">
          Selecione uma organização
        </p>
      </main>
    </div>
  );
};

export default Home;
