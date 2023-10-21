import { GoInfo } from "react-icons/go";

interface Props {
    icon: JSX.Element,
    title: string,
    info?: string,
}

const TitleBar = (p: Props) => {
    return (
        <div className="grid items-center grid-cols-3 p-2 px-3 bg-custom-800">
            <div></div>
            <div className="flex flex-row items-center justify-center gap-2">
                {p.icon}
                <div>{p.title}</div>
            </div>
            <div className="flex justify-end">
                {p.info ?
                    <div className="tooltip tooltip-left" data-tip={p.info} >
                        <GoInfo />
                    </div>
                    : ''}
            </div>
        </div>
    )
}
export default TitleBar;