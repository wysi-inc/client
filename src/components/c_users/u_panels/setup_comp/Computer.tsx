import { ChangeEvent, Dispatch, SetStateAction } from "react";
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

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (!p.edit) return;
        p.setComputer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

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
                    <EditInput value={p.computer.cpu} onChange={handleChange} name="cpu" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsGpuCard />
                    <div>{t('user.sections.setup.components.gpu')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.gpu} onChange={handleChange} name="gpu" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsMemory />
                    <div>{t('user.sections.setup.components.ram')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.ram} onChange={handleChange} name="ram" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsDeviceHdd />
                    <div>{t('user.sections.setup.components.storage')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.storage} onChange={handleChange} name="storage" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsFillMotherboardFill />
                    <div>{t('user.sections.setup.components.motherboard')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.motherboard} onChange={handleChange} name="motherboard" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsFillLightningChargeFill />
                    <div>{t('user.sections.setup.components.psu')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.psu} onChange={handleChange} name="psu" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsPc />
                    <div>{t('user.sections.setup.components.case')}</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.computer.case} onChange={handleChange} name="case" edit={p.edit} />
                </div>
            </div>
        </div>
    )
}

export default Computer;