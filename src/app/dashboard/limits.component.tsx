'use client';

import { Card, CardBody, CardFooter, Chip, CircularProgress, Progress } from "@nextui-org/react";

export function LimitsWidget({ precision = 0, total = 100, used = 0 }){
    const limit : number = used / Math.pow( 10, precision );

    return <Card className="w-[240px] h-[240px] border-none bg-primary">
    <CardBody className="justify-center items-center pb-0">
      <CircularProgress
        classNames={{
          svg: "w-36 h-36 drop-shadow-md",
          indicator: "stroke-white",
          track: "stroke-white/10",
          value: "text-3xl font-semibold text-white",
        }}
        value={ (100 * used) / total }
        strokeWidth={4}
        showValueLabel={true}
      />
    </CardBody>
    <CardFooter className="justify-center items-center pt-0">
      <Chip
        classNames={{
          base: "border-1 border-white/30",
          content: "text-white/90 text-xs font-semibold",
        }}
        variant="bordered"
      >
        Emissão de Token
      </Chip>
    </CardFooter>
  </Card>
}

export function LimitsSqueleton(){
    return <Card className="w-[240px] h-[240px] border-none bg-primary">
    <CardBody className="justify-center items-center pb-0">
      <CircularProgress
        classNames={{
          svg: "w-36 h-36 drop-shadow-md",
          indicator: "stroke-white",
          track: "stroke-white/10",
          value: "text-3xl font-semibold text-white",
        }}
        isIndeterminate
        strokeWidth={4}
      />
    </CardBody>
    <CardFooter className="justify-center items-center pt-0">
      <Chip
        classNames={{
          base: "border-1 border-white/30",
          content: "text-white/90 text-xs font-semibold",
        }}
        variant="bordered"
      >
        carregando...
      </Chip>
    </CardFooter>
  </Card>
}