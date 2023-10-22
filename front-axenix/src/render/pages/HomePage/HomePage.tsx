import { useEffect, useRef, useState } from "react";
import { Header } from "../../containers/Header/Header";
import { Input } from "../../ui/Input/Input";
import { ModalPopup } from "../../ui/ModalPopup/ModalPopup";
import { Canvas } from "../../containers/Canvas/Canvas";

import "./style.scss";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <div className="menu">
        <div className="menu__row">
          <Link className="menu__item menu__item_warhouse" to={"/test"}>
            <span>Мониторинг складов</span>
          </Link>
          <Link className="menu__item menu__item_forklifters" to={"/forkslist"}>
            <span>Погрузчики</span>
          </Link>
        </div>
        <div className="menu__row">
          <Link className="menu__item menu__item_history" to={"/history"}>
            <span>История заказов</span>
          </Link>
          <Link className="menu__item menu__item_records" to={"/"}>
            <span>Аналитика и отчёты</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export { HomePage };
