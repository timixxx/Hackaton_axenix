import { useState } from "react";
import './style.scss'
export const Input = ({ defaultValue, label, onChange, placeHolder }) => {
  const [value, setValue] = useState(defaultValue);


  return (
    <>
      {label && <label className="label">{label}</label>}
      <input className="input" type="text" value={value} onChange={(e)=>onChange(e)} placeholder={placeHolder}/>
    </>
  );
};
