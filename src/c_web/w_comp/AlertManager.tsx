import React from "react";
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
    return (
        <div className={`alert alert-${props.type}`}>
            {getIcon()}
            <span>{props.text}</span>
            <button onClick={() => delAlert(props.id)}>
                <IoClose />
            </button>
        </div>
    )
}

const AlertManager = () => {
    const alerts = alertManager((state: alertManagerInterface) => state.alerts);
    return (
        <div>
            {alerts.map(a => <Alert key={a.id} id={a.id} type={a.type} text={a.text} />)}
        </div>
    )
}

export default AlertManager;