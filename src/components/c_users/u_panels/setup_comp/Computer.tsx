import { Dispatch, SetStateAction } from "react";
import { BsCpu, BsDeviceHdd, BsFillLightningChargeFill, BsFillMotherboardFill, BsGpuCard, BsMemory, BsPc } from "react-icons/bs";
import EditInput from "./EditInput";
import { ComputerInterface } from "../../../../resources/interfaces/setup";
import { useTranslation } from "react-i18next";

interface ComputerProps {
    edit: boolean,
    computer: ComputerInterface,
    setComputer: Dispatch<SetStateAction<ComputerInterface>>;
}

const Computer = (p: ComputerProps) => {
    const {t} = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3">
                <div className="col-span-1">{t('user.sections.setup.components.component')}</div>
                <div className="col-span-2">{t('user.sections.setup.components.details')}</div>
            </div>
            <div className="col-span-4 p-0 m-0 divider"></div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsCpu />
                    <div>{t('user.sections.setup.components.cpu')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.cpu} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, cpu: n }))} edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsGpuCard />
                    <div>{t('user.sections.setup.components.gpu')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.gpu} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, gpu: n }))} edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsMemory />
                    <div>{t('user.sections.setup.components.ram')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.ram} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, ram: n }))} edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsDeviceHdd />
                    <div>{t('user.sections.setup.components.storage')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.storage} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, storage: n }))} edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsFillMotherboardFill />
                    <div>{t('user.sections.setup.components.motherboard')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.mohterboard} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, mohterboard: n }))} edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsFillLightningChargeFill />
                    <div>{t('user.sections.setup.components.psu')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.psu} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, psu: n }))} edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsPc />
                    <div>{t('user.sections.setup.components.case')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.case} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, case: n }))} edit={p.edit} />
                </div>
            </div>
        </div>
    )
}

export default Computer;