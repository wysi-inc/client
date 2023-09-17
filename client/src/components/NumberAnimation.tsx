import React, { useState, useEffect } from "react";

interface AnimationProps {
    num: number;    
}
const NumberAnimation = (props: AnimationProps) => {
    const speed = 200;
    const time = props.num / speed;
    const [newNum, setNewNum] = useState(0);
    useEffect(() => {
        incrementNumber();
    }, [])

    function incrementNumber() {
        if (newNum > props.num) {
            setNewNum(props.num);
            return;
        }
        console.log(newNum, props.num);
        setTimeout(() => {
            if (newNum === props.num) return;
            setNewNum((prev) => prev + 1);
            incrementNumber();
        }, time);
    }
    return (
        <>
            {newNum.toLocaleString()}
        </>
    )
}
export default NumberAnimation;