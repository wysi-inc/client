import { GoInfo } from "react-icons/go";

interface Props {
    icon: JSX.Element,
    title: string,
    info?: string,
    left?: JSX.Element,
}

const TitleBar = (p: Props) => {
    return (
        <div className="grid items-center grid-cols-3 p-2 px-3 rounded-t-lg bg-custom-800">
            <div>{p.left}</div>
            <div className="flex flex-row items-center justify-center gap-2">
                {p.icon}
                <div>{p.title}</div>
            </div>
            <div className="flex justify-end">
                {p.info ?
                    <div className="tooltip" data-tip={p.info} >
                        <GoInfo />
                    </div>
                    : ''}
            </div>
        </div>
    )
}
export default TitleBar;