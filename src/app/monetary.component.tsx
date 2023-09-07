'use client';

import { useState } from "react";

export default function MonetaryWidget() {
    const [index, setIndex] = useState(1);

    function alternate( to : 1 | 2 ){
        setIndex( to );
    }

    return <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-row gap-6">
            <span className="py-2 font-bold">Modos</span>
            <div onClick={ () => alternate(1) } className={`px-4 py-2 border-1 border-transparent rounded-full transition-all cursor-pointer hover:border-primary ${ index == 1 ? 'bg-primary' : '' }`}>pontuação</div>
            <div onClick={ () => alternate(2) } className={`px-4 py-2 border-1 border-transparent rounded-full transition-all cursor-pointer hover:border-primary ${ index == 2 ? 'bg-primary' : '' }`}>monetário</div>
        </div>
        <div className={`shadow-2xl border-1 border-neutral-100 p-10 rounded-[40px] w-full transition-transform rotate-x-[5deg] ${ index == 1 ? '-rotate-y-[30deg]' : 'rotate-y-[30deg]' }`}>
            <div className="text-xl">Saldo</div>
            <div className="text-3xl mt-5 transition-all flex flex-row leading-none">
                <span className={ `transition-all ${ index == 1 ? `opacity-0 -translate-x-10` : `opacity-100 translate-x-0` }` }>₼</span>
                <span className={ `font-bold ${ index == 1 ? `-translate-x-6` : `translate-x-0` }` }>1.000</span>
                <span className={ `font-bold transition-all ${ index == 1 ? `opacity-0 ml-10` : `opacity-100 ml-0` }` }>,99</span>
            </div>
            <span className={ `transition-all text-md -translate-y-10 ${ index == 2 ? `opacity-0` : `opacity-100` }` }>pontos</span>
        </div>
    </div>;
}