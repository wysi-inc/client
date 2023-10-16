import { BsCpu, BsCpuFill, BsDeviceHdd, BsFillLightningChargeFill, BsFillMotherboardFill, BsGpuCard, BsMemory, BsPc } from "react-icons/bs";

const Computer = () => {

    // cpu: String,
    // gpu: String,
    // ram: String,
    // psu: String,
    // storage: String,
    // mohterboard: String,
    // case: String,
    // other: String,

    const components = [
        { icon: <BsCpu />, name: 'CPU', details: 'Ryzen 7 2700X', link: 'https://test.com/test' },
        { icon: <BsGpuCard />, name: 'GPU', details: 'Nvidia RTX 3060 Ti 8Gb', link: 'https://example.com' },
        { icon: <BsMemory />, name: 'RAM', details: 'Corsair Vengance RGB Pro 16Gb', link: 'https://example.com' },
        { icon: <BsDeviceHdd />, name: 'Storage', details: '1Tb NVMe SSD Crucial + 500Gb HDD', link: 'https://example.com' },
        { icon: <BsFillMotherboardFill />, name: 'Motherboard', details: 'Ryzen 7 2700X', link: 'https://example.com' },
        { icon: <BsPc />, name: 'Case', details: 'NZXT H700', link: 'https://example.com' },
        { icon: <BsFillLightningChargeFill />, name: 'PSU', details: '750W', link: 'https://example.com' },
    ]

    function getBaseURL(url: string) {
        const pathArray = url.split('/');
        const protocol = pathArray[0];
        const host = pathArray[2];
        return protocol + '//' + host;
    }

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Details</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {components.map((c) =>
                        <tr>
                            <th className="flex flex-row gap-2 items-center">
                                {c.icon}
                                <div>{c.name}</div>
                            </th>
                            <td>{c.details}</td>
                            <a href={c.link} target="_blank">{getBaseURL(c.link)}</a>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>
    )
}

export default Computer;