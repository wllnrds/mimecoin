import { ButtonLink } from "@/components/button.component";
import HeaderMenu from "./features.component";
import MonetaryWidget from "./monetary.component";

import type { Metadata } from "next";
import Footer from "./footer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Página inicial",
};

export default async function Home() {
  return (
    <div className="bg-primary">
      <div className="bg-white rounded-t-[2rem] mt-4 flex flex-col">
        <HeaderMenu />
        <div className="p-2 md:p-5 flex flex-col gap-10">
          <header className="m-2 md:m-5 relative flex gap-3 flex-col">
            <div
              className="flex gap-3 flex-col relative rounded-[2rem] bg-cover bg-center"
              style={{
                backgroundImage: "url(/assets/home/cover.png)",
                minHeight: "max(calc(85vh - 10rem), 16rem)",
              }}
            ></div>
            <span className="text-right text-xs">
              *Mimecoin não transaciona dinheiro real
            </span>
            <div className="absolute top-0 left-0 p-10 md:p-20 max-w-xl text-white flex flex-col gap-4 items-start">
              <div className="text-5xl sm:text-6xl leading-[1.1] drop-shadow-md">
                O primeiro banco virtual digital*
              </div>
              <p className="sm:max-w-md text-xl drop-shadow-md">
                Ideal para pontos de fidelidade, pontos de recompensa e outras
                aplicações de tokenização.
              </p>
              <ButtonLink
                auth="all"
                event={{ name: "create_mime", body: { origin: "big_header" } }}
                href="/new/mime"
                style="bg-primary hover:bg-primary-600"
              >
                criar seu mime
              </ButtonLink>
            </div>
          </header>

          <section
            className="m-2 md:m-5 flex gap-3 flex-col lg:flex-row relative rounded-[2rem] bg-center justify-center"
            style={{ minHeight: "max(calc(85vh - 10rem), 16rem)" }}
          >
            <div className="flex-1 p-10 md:p-20 max-w-xl flex flex-col gap-4 items-start justify-center">
              <div className="text-5xl sm:text-6xl leading-[1.1]">
                <span className="drop-shadow-md">Seu próprio</span>{" "}
                <span className="text-primary">domínio econômico</span>
              </div>
              <p className="sm:max-w-md text-xl">
                Cada Mime tem sua cunhagem separa e você é o único que tem
                controle da emissão de novos tokens.
              </p>
              <ButtonLink
                auth="all"
                href="/new/mime"
                event={{ name: "create_mime", body: { origin: "mime_types" } }}
                style="bg-primary hover:bg-primary-600"
              >
                criar seu mime
              </ButtonLink>
            </div>
            <div className="flex-1 p-10 md:p-20 max-w-xl flex flex-col gap-4 items-center justify-center">
              <MonetaryWidget />
            </div>
          </section>

          <section
            className="m-2 md:m-5 flex gap-3 flex-col lg:flex-row relative rounded-[2rem] bg-center bg-gradient-to-tr from-primary-600 via-primary to-primary-400"
            style={{ minHeight: "max(calc(85vh - 10rem), 16rem)" }}
          >
            <div className="flex-1 p-10 md:p-20 flex flex-col gap-4 items-start justify-center">
              <div className="text-5xl sm:text-6xl leading-[1.1] drop-shadow-md">
                <span className="drop-shadow-md">bank-</span>
                <span className="text-white">like</span>
              </div>
              <p className="sm:max-w-md text-xl">
                Todas as transações são seguras e construídas com um sistema
                antifraude que foi construída como um banco real.
              </p>
              <ButtonLink
                auth="all"
                href="/new/mime"
                event={{ name: "create_mime", body: { origin: "features" } }}
                style="bg-white hover:bg-slate-200"
              >
                criar seu mime
              </ButtonLink>
            </div>
            <div className="flex-1 p-10 md:p-20 flex flex-col gap-4 justify-center">
              <div className="bg-white rounded-2xl py-3 px-4 flex flex-row gap-3 items-center transition-all hover:shadow-small hover:-translate-y-1 ">
                <span className="w-8 h-8 flex items-center justify-center text-2xl text-primary">
                  <span className="material-icon">check</span>
                </span>
                conta digital
              </div>
              <div className="bg-white rounded-2xl py-3 px-4 flex flex-row gap-3 items-center transition-all hover:shadow-small hover:-translate-y-1 ">
                <span className="w-8 h-8 flex items-center justify-center text-2xl text-primary">
                  <span className="material-icon">check</span>
                </span>
                controle de cunhagem / geração
              </div>
              <div className="bg-white rounded-2xl py-3 px-4 flex flex-row gap-3 items-center transition-all hover:shadow-small hover:-translate-y-1 ">
                <span className="w-8 h-8 flex items-center justify-center text-2xl text-primary">
                  <span className="material-icon">check</span>
                </span>
                transferência entre contas
              </div>
              <div className="bg-white rounded-2xl py-3 px-4 flex flex-row gap-3 items-center transition-all hover:shadow-small hover:-translate-y-1 ">
                <span className="w-8 h-8 flex items-center justify-center text-2xl text-primary">
                  <span className="material-icon">check</span>
                </span>
                boleto de cobrança
              </div>
              <div className="bg-white rounded-2xl py-3 px-4 flex flex-row gap-3 items-center transition-all hover:shadow-small hover:-translate-y-1 ">
                <span className="w-8 h-8 flex items-center justify-center text-2xl text-primary">
                  <span className="material-icon">check</span>
                </span>
                pagamento virtual
              </div>
              <div className="bg-white rounded-2xl py-3 px-4 flex flex-row gap-3 items-center transition-all hover:shadow-small hover:-translate-y-1 ">
                <span className="w-8 h-8 flex items-center justify-center text-2xl text-primary">
                  <span className="material-icon">check</span>
                </span>
                consulta de saldo e extrato
              </div>
              <span className="text-xs">
                *Todas as transações usam o token da conta em que foi gerada e
                não representam valores monetários reais
              </span>
            </div>
          </section>

          <section
            className="m-2 md:m-5 flex-col flex gap-10 relative rounded-[2rem] bg-center justify-center"
            style={{ minHeight: "max(calc(85vh - 10rem), 16rem)" }}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl leading-[1.1]">
                <span className="drop-shadow-md">Preços</span>{" "}
                <span className="text-primary"></span>
              </div>
            </div>
            <div className=" relative w-full flex flex-col md:flex-row gap-10 justify-center items-center">
              <div className="min-w-[22rem] max-w-[280px] bg-white w-full overflow-clip flex flex-col gap-4">
                <div className="px-3 py-3 bg-primary text-center font-black uppercase rounded-[2rem]">
                  grátis
                </div>
                <div className="p-3 text-xs">
                  <ul className="p-3">
                    <li className="py-2">
                      <strong>Sistemas</strong> 1 por conta
                    </li>
                    <li className="py-2">
                      <strong>Modos</strong> <span>pontos</span> |{" "}
                      <span>monetário</span>
                    </li>
                    <li className="py-2">
                      <strong>Precisão decimal</strong> <span>0</span> ou{" "}
                      <span>2</span>
                    </li>
                    <li className="py-2">
                      <strong>Limite</strong> 10000 unidades*
                    </li>
                    <li className="py-2">
                      <strong>Máximo de contas</strong> 89.999 contas
                    </li>
                  </ul>
                  <div className="md:h-10"></div>
                </div>
                  <ButtonLink
                    auth="all"
                    href="/new/mime"
                    event={{ name: "create_mime", body: { origin: "pricing" } }}
                    style="bg-primary items-center justify-center hover:bg-primary-500"
                  >
                    criar seu mime
                  </ButtonLink>
                <p className="text-[0.6rem] text-slate-500">
                  * Equivalentes no sistema de pontos a 10000 pontos e no
                  monetário ₼10000.00.
                </p>
              </div>
              <div className="min-w-[22rem] max-w-[280px] border-1 bg-white rounded-[2rem] w-full overflow-clip flex flex-col">
                <div className="p-6 flex flex-col text-xs flex-1 items-center justify-center gap-4 md:gap-10">
                  <p className="">Precisa de algo específico?</p>
                  <ButtonLink
                    auth="all"
                    target="_blank"
                    href="mailto:w.almeida.w@gmail.com"
                    style="bg-primary hover:bg-slate-200"
                  >
                    Entre em contato
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
