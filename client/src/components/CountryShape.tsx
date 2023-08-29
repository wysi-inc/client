import React from 'react';

interface CountryShapeProps {
    code: string;
    width: number;
    height: number;
}

const CountryShape = (props: CountryShapeProps) => {
    try {
        const svgFile = require(`../assets/countries/${props.code.toLowerCase()}/vector.svg`);
        return (
            <img className="countryIco"
                 alt="ico"
                 style={{
                     filter: 'brightness(0) invert(1)',
                     height: props.height,
                     width: props.width
                 }} src={svgFile}/>
        );
    } catch (error) {
        console.error(`Error loading SVG for code ${props.code}:`, error);
        return (<div>?</div>);
    }
}

export default CountryShape;