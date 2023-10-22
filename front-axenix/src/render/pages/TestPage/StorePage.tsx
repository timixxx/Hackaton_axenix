import { useEffect, useRef, useState } from "react";
import { Header } from "../../containers/Header/Header";
import { ModalPopup } from "../../ui/ModalPopup/ModalPopup";
import { Canvas } from "../../containers/Canvas/Canvas";

import "./style.scss";
import {
  getForkliftersInWarhouse,
  getWarehouses,
  getForkliftData,
} from "../../../services/fetch.js";
const StorePage = () => {
  const [isOpen, setOpen] = useState(false);
  const [currentForkLift, setCurrentForkLift] = useState({
    currentPoint: "K1",
    nextPoint: "K2",
    prevPNum: 1,
    nextPNum: 2,
  });

  const [warehouses, setWarehouses] = useState(null);
  const [forks, setForks] = useState(null);
  useEffect(() => {
    getWarehouses().then((r) => setWarehouses(r));

    getForkliftersInWarhouse({ warehouse_id: 1 }).then((r) => {
      setForks(r);
      if (r && r.length > 0) {
        console.log(r);
        setCurrentForkLift({
          currentPoint: "K" + r[0].current_point,
          nextPoint: "K" + r[0].next_point,
          prevPNum: r[0].current_point,
          nextPNum: r[0].next_point,
          id: r[0].id,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (currentForkLift.id)
      setInterval(() => {
        getForkliftData({ id: currentForkLift.id, warehouse_id: 1 }).then(
          (r) => {
            if (r && r.length > 0)
              setCurrentForkLift({
                currentPoint: "K" + r[0].current_point,
                nextPoint: "K" + r[0].next_point,
                prevPNum: r[0].current_point,
                nextPNum: r[0].next_point,
                id: r[0].id,
              });
          }
        );
      }, 1500);
  }, [JSON.stringify(currentForkLift)]);

  const open = () => {
    setCurrentForkLift(true);
    setOpen(true);
  };

  return (
    <>
      <Header />
      <div className="warhouse">
        <Canvas
          width={1000}
          height={600}
          handleClick={open}
          forklift={currentForkLift}
        />
        <div className="forklifts__list">
          {forks &&
            forks.length > 0 &&
            forks.map((item, i) => {
              return (
                <div
                  className={`forklift__item ${
                    item.id == currentForkLift.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setCurrentForkLift({
                      currentPoint: "K" + item.current_point,
                      nextPoint: "K" + item.next_point,
                      prevPNum: item.current_point,
                      nextPNum: item.next_point,
                      id: item.id,
                    });
                  }}
                >
                  <div className="forklift__name">{item.id}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export { StorePage };
