import { useState } from "react";
import "./style.scss";

export const ModalPopup = ({body, closeMethod, title}) => {
  const [isOpen, setOpen] = useState(true)

  return (
    <div className="modal">
      <div className="popup__container">
        <div className="popup__close-btn" onClick={()=>closeMethod(false)}/>
        <div className="popup__title">{title}</div>
        {body}
      </div>
    </div>
  );
};
