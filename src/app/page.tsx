import { ButtonLink } from "@/components/auth/buttons.components";

import HeaderMenu from "./features.component";

export default async function Home() {
  return (<div className="bg-primary">
    <div className="bg-white rounded-t-[40px] mt-4 flex flex-col gap-10">
      <HeaderMenu />
      <div className="px-3 md:px-10 flex flex-col gap-10">
        <header className="relative flex gap-3 flex-col">
          <div className="flex gap-3 flex-col relative rounded-[40px] bg-cover bg-center" style={{ backgroundImage: 'url(/assets/home/cover.png)', minHeight: 'max(calc(100vh - 15rem), 480px)' }} ></div>
          <span className="text-right text-xs">*Mimecoin não transaciona dinheiro real</span>
          <div className="absolute top-0 left-0 p-10 md:p-20 max-w-xl text-white flex flex-col gap-4 items-start">
            <div className="text-5xl sm:text-6xl leading-[1.1] drop-shadow-md">O primeiro banco virtual digital*</div>
            <p className="sm:max-w-md text-xl drop-shadow-md">Ideal para pontos de fidelidade, pontos de recompensa e outras aplicações de tokenização.</p>
            <ButtonLink auth="all" href="/" style="bg-primary hover:bg-primary-600">criar seu mime</ButtonLink>
          </div>
        </header>
        <main className="flex items-center justify-center">
          
        </main>
      </div>
    </div>
  </div>);
}
