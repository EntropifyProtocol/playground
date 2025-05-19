"use client";

import Header from "../components/Header/Header";
import EntropyReservoir from "../components/EntropyReservoir/EntropyReservoir";
import StarknetProvider from "../components/StarknetProvider/StarknetProvider";

export default function Home() {
  return (
    <StarknetProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <EntropyReservoir initialValue={1000} />
        </main>
      </div>
    </StarknetProvider>
  );
}
