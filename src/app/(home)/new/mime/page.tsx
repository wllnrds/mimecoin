import { Suspense } from "react";
import LimitWare from "./limit";

export default function Page(){
    const loading_state = <div className="flex h-full flex-1 flex-row bg-foreground p-4 items-center justify-center"><div className="flex flex-col gap-2 bg-white p-8 rounded-[2rem] w-full max-w-2xl animate-pulse"><p className="text-center">Preparando</p></div></div>

    return <Suspense fallback={ loading_state }>
        <LimitWare />
    </Suspense>
}