import { Suspense } from "react";
import LimitWare from "./limit";

export default function Page(){
    const loading_state = (<div className="flex flex-row items-center p-8 justify-center">
        <div className="flex flex-col gap-2 bg-secondary p-8 rounded-[2rem] w-full max-w-5xl animate-pulse">
            <p className="text-center">Preparando</p>
        </div>
    </div>)

    return <div className="max-w-7xl w-full flex-1 m-auto p-4 flex flex-col">
        <Suspense fallback={ loading_state }>
            <LimitWare />
        </Suspense>
    </div>
}