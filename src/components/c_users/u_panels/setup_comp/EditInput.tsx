import { ChangeEvent } from "react";

interface EditInputProps {
    edit: boolean,
    value: string,
    name: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

const EditInput = (p : EditInputProps) => {
    if (p.edit) return <input className="input input-sm input-bordered grow" name={p.name} value={p.value} onChange={p.onChange} type="text"/>
    return <div>{p.value}</div>
    
}
export default EditInput;