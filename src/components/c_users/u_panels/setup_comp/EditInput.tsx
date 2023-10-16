interface EditInputProps {
    edit: boolean,
    value: string,
    setValue: (newVal: string) => void,
}

const EditInput = (p : EditInputProps) => {
    if (p.edit) return <input className="input input-sm input-bordered grow" value={p.value} onChange={(e) => p.setValue(e.target.value)} type="text"/>
    return <div>{p.value}</div>
    
}
export default EditInput;