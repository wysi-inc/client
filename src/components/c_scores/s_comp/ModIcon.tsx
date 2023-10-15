interface ModIconProps {
    acronym: string;
    size: number;
}
const ModIcon = (props: ModIconProps) => {
    return (
        <div className="tooltip"
            data-tip={props.acronym}>
            <img style={{ height: props.size }}
                src={require(`../../../assets/mod-icons/${props.acronym ? props.acronym.toLowerCase() : 'nm'}.png`)}
                loading="lazy"
                alt={props.acronym} />
        </div>
    )
}
export default ModIcon;