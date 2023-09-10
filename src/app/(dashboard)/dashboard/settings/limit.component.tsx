'use client';

import { Card, CardBody, CardFooter, Chip, Progress } from "@nextui-org/react";

export function LimitsWidget({ total = 100, used = 0 }) {
    return <Card className="flex-1 border-none rounded-3xl  bg-foreground-900 shadow-none">
        <CardBody className="justify-center">
            <h2 className="text-default text-lg">Seu limite de Criação de Mimes</h2>
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-6 lg:items-center">
                <div>
                    <Chip classNames={{ base: "border-1 text-default/30", content: "text-default/90 text-xs font-semibold", }} variant="bordered" >
                        Você criou {used} mime. Seu limite é {total}.
                    </Chip>
                </div>
                <div className="flex-1">
                    <Progress
                        classNames={{
                            track: "drop-shadow h-6 border border-default/30",
                            indicator: "bg-secondary-300",
                            label: "tracking-wider font-medium text-default-600",
                        }}
                        value={(100 * used) / total}
                        showValueLabel={false}
                    />
                </div>
            </div>
        </CardBody>
    </Card>
}

export function LimitsSqueleton() {
    return <Card className="w-full border-none bg-white shadow">
    <CardBody className="justify-center space-y-6">
        <h2 className="text-default">Seu limite de Criação de Mimes</h2>
        <Chip
            classNames={{
                base: "border-1 text-default/30",
                content: "text-default/90 text-xs font-semibold",
            }}
            variant="bordered"
        >Carregando seu limite
        </Chip>
        <Progress
            classNames={{
                track: "drop-shadow h-6 border border-default/30",
                indicator: "bg-secondary-300",
                label: "tracking-wider font-medium text-default-600",
            }}
            isIndeterminate
            showValueLabel={false}
        />
    </CardBody>
    <CardFooter className="justify-center pt-0">
    </CardFooter>
</Card>
}