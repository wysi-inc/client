
interface OnlineDotInterface {
    isOnline: boolean;
    size: number;
}

const OnlineDot = (props: OnlineDotInterface) => {
    return (
        <div style={{
            height: props.size,
            width: props.size,
            borderRadius: props.size,
            borderColor: props.isOnline ? '#45d845' : '#d84545',
            borderWidth: props.size / 7,
            borderStyle: "solid"
        }}></div>
    )
}

export default OnlineDot;