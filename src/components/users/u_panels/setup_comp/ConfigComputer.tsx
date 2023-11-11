import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { useTranslation } from "react-i18next";

import { BsCpu, BsDeviceHdd, BsFillLightningChargeFill, BsFillMotherboardFill, BsGpuCard, BsMemory, BsPc } from "react-icons/bs";

import EditInput from "./EditInput";
import { Computer } from "../../../../resources/types/setup";

interface Props {
    edit: boolean,
    computer: Computer,
    setComputer: Dispatch<SetStateAction<Computer>>;
}

const ConfigComputer = (p: Props) => {
    const {t} = useTranslation();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (!p.edit) return;
        p.setComputer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const items = [
        { name: "cpu", title: t('user.sections.setup.components.cpu'), icon: <BsCpu /> },
        { name: "gpu", title: t('user.sections.setup.components.gpu'), icon: <BsGpuCard /> },
        { name: "ram", title: t('user.sections.setup.components.ram'), icon: <BsMemory /> },
        { name: "storage", title: t('user.sections.setup.components.storage'), icon: <BsDeviceHdd /> },
        { name: "motherboard", title: t('user.sections.setup.components.motherboard'), icon: <BsFillMotherboardFill /> },
        { name: "psu", title: t('user.sections.setup.components.psu'), icon: <BsFillLightningChargeFill /> },
        { name: "case", title: t('user.sections.setup.components.case'), icon: <BsPc /> },
    ]

    return (
        <table className="table">
            <thead>
                <tr>
                    <th className="p-1">{t('user.sections.setup.components.component')}</th>
                    <th className="p-1">{t('user.sections.setup.components.details')}</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, i: number) =>
                    (p.computer as any)[item.name] !== "" || p.edit ?
                        <tr key={i}>
                            <th className="flex flex-row items-center gap-3 p-1">{item.icon}<div>{item.title}</div></th>
                            <th className="p-1">
                                <EditInput value={(p.computer as any)[item.name]} onChange={handleChange} name={item.name} edit={p.edit} />
                            </th>
                        </tr> : ''
                )}
            </tbody>
        </table>
    )
}

export default ConfigComputer;