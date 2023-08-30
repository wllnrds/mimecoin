import { ButtonLink } from "@/components/auth/buttons.components";

import HeaderMenu from "./features.component";

export default async function Home() {
  return (<div className="bg-primary">
    <div className="bg-white rounded-t-[40px] mt-4 flex flex-col gap-10">
      <HeaderMenu />
      <div className="p-10 flex flex-col gap-10">
        <header className="relative flex gap-3 flex-col">
          <div className="flex w-full gap-3 flex-col relative rounded-[40px] aspect-[16/9] bg-cover" style={{ backgroundImage: 'url(/assets/home/cover.png)' }} ></div>
          <span className="text-right text-xs">*Mimecoin não transaciona dinheiro real</span>
          <div className="absolute top-20 left-20 max-w-[40%] text-white flex flex-col gap-4 items-start">
            <div className="text-6xl leading-[1.1]">O primeiro banco virtual digital*</div>
            <p className="w-[55%]">Ideal para pontos de fidelidade, pontos de recompensa e outras aplicações de tokenização.</p>
            <ButtonLink auth="all" href="/" style="bg-primary hover:bg-primary-600">criar seu mime</ButtonLink>
          </div>
        </header>
        <main className="flex items-center justify-center">
          
        </main>
      </div>
    </div>
  </div>);
}
