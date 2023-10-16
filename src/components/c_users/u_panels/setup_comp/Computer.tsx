import { Dispatch, SetStateAction } from "react";
import { BsCpu, BsDeviceHdd, BsFillLightningChargeFill, BsFillMotherboardFill, BsGpuCard, BsMemory, BsPc } from "react-icons/bs";
import EditInput from "./EditInput";
import { useState } from "react";
import { ComputerInterface } from "../../../../resources/interfaces/setup";

interface ComputerProps {
    edit: boolean,
    computer: ComputerInterface,
    setComputer: Dispatch<SetStateAction<ComputerInterface>>;
}

const Computer = (p: ComputerProps) => {

    const [cpu, setCpu] = useState({ icon: <BsCpu />, name: 'CPU', details: 'Ryzen 7 2700X' });
    const [gpu, setGpu] = useState({ icon: <BsGpuCard />, name: 'GPU', details: 'Nvidia RTX 3060Ti' });
    const [ram, setRam] = useState({ icon: <BsMemory />, name: 'RAM', details: '16Gb 3200mhz' });
    const [ssd, setSsd] = useState({ icon: <BsDeviceHdd />, name: 'SSD', details: '1Tb NVMe SSD' });
    const [mtb, setMtb] = useState({ icon: <BsFillMotherboardFill />, name: 'Motherboard', details: 'MSI Tomahawk Max' });
    const [pcc, setPcc] = useState({ icon: <BsPc />, name: 'Case', details: 'NZXT h700' });
    const [psu, setPsu] = useState({ icon: <BsFillLightningChargeFill />, name: 'PSU', details: '750W' });

    return (
        <div>
            <div className="grid grid-cols-4">
                <div className="col-span-1">Component</div>
                <div className="col-span-3">Details</div>
            </div>
            <div className="divider p-0 m-0 col-span-4"></div>
            <div>
                <div className="col-span-1 flex flex-row gap-2 items-center">
                    <BsCpu />
                    <div>CPU</div>
                </div>
                <div className="col-span-3">
                    <EditInput value={p.computer.cpu} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, cpu: n }))} edit={p.edit} />
                </div>
            </div>
            <div>
                <div className="col-span-1 flex flex-row gap-2 items-center">
                    <BsCpu />
                    <div>CPU</div>
                </div>
                <div className="col-span-3">
                    <EditInput value={p.computer.cpu} setValue={(n: string) => p.setComputer((prev) => ({ ...prev, cpu: n }))} edit={p.edit} />
                </div>
            </div>
        </div>
    )
}

export default Computer;