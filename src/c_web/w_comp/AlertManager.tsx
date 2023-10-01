import React, { useEffect } from "react";
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import { alertManager, alertManagerInterface } from "../../resources/store/tools";
import { IoClose } from "react-icons/io5"

export type alertType = 'info' | 'success' | 'warning' | 'error';
export interface alertProps {
    id: number,
    type: alertType,
    text: string;
}
const Alert = (props: alertProps) => {
    const delAlert = alertManager((state: alertManagerInterface) => state.delAlert);
    function getIcon() {
        switch (props.type) {
            case 'info': return <FaInfoCircle />;
            case 'success': return <FaCheckCircle />;
            case 'warning': return <FaExclamationTriangle />;
            case 'error': return <FaTimesCircle />;
            default: return <FaQuestionCircle />
        }
    }

    function getColor() {
        switch (props.type) {
            case 'error': return '#ff5757';
            case "info": return '#8be8fd';
            case "success": return '#52fa7c';
            case "warning": return '#f1fa89';
        }
    }

    return (
        <div className="ms-auto fadein">
            <div className='py-1 pr-1 pl-3 border-none drop-shadow-md alert text-base-100'
                style={{ backgroundColor: getColor() }}>
                {getIcon()}
                <span>{props.text}</span>
                <button className="m-0 btn btn-ghost btn-circle btn-sm"
                    onClick={() => delAlert(props.id)}>
                    <IoClose />
                </button>
            </div>
        </div>
    )
}

const AlertManager = () => {
    // const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);
    // useEffect(() => {
    //     addAlert('error', 'test error');
    //     addAlert('warning', 'test warning');
    //     addAlert('success', 'test success');
    //     addAlert('info', 'test info');
    // }, [])
    const alerts = alertManager((state: alertManagerInterface) => state.alerts);
    return (
        <div className="flex fixed inset-x-0 top-0 flex-col gap-1 p-1 pt-16 mt-1">
            {alerts.map(a => <Alert key={a.id} id={a.id} type={a.type} text={a.text} />)}
        </div>
    )
}

export default AlertManager;