import { Dispatch, SetStateAction } from "react";

interface EditInputProps {
    edit: boolean,
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
}

const EditInput = (p : EditInputProps) => {
    if (p.edit) return <input value={p.value} onChange={(e) => p.setValue(e.target.value)} type="text"/>
    return <div>{p.value}</div>
    
}
export default EditInput;