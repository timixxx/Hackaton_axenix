import { useRef, useEffect, useState } from "react";
import {
  getForkliftersInWarhouse,
  getWarehouses,
} from "../../../services/fetch.js";

import { Zoom } from "react-preloaders";

import "./style.scss";
import { ModalPopup } from "../../ui/ModalPopup/ModalPopup.js";
// import useInterval from "use-interval";

export function Canvas(props) {
  const canvasRef = useRef(null);
  const prevCountRef = useRef(null);
  const [prevFork, setPrevFork] = useState(null);

  const [isOpen, setOpen] = useState(false);

  const [counter, setCounter] = useState(0);
  const stateRef = useRef(counter);

  class Box {
    constructor(xpoint, ypoint, width, height, text) {
      this.xpoint = xpoint;
      this.ypoint = ypoint;
      this.width = width;
      this.height = height;
      this.text = text;
    }
    draw(context) {
      context.beginPath();
      context.fillStyle = "#4e342c";
      context.fillRect(this.xpoint, this.ypoint, this.width, this.height);
      context.fillStyle = "white";
      context.font = "bold 18px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(this.text, this.xpoint + 125, this.ypoint + 25);
      context.closePath();
    }
  }

  const CONTROL_PONTS = {
    K1: { cX: 875, cY: 525, outPointY: { x: 892, y: 520 } }, // Точка готова
    K2: {
      // Точка готова
      cX: 875,
      cY: 400,
      inpPointY: { x: 894, y: 456 }, // Готово
      outPointX: { x: 870, y: 432 }, // Готово
      outPointY: { x: 894, y: 396 }, // Готово
    },
    K3: {
      // Точка готова
      cX: 600,
      cY: 400,
      inpPointX: { x: 654, y: 432 }, // Готово
      outPointX: { x: 596, y: 432 }, // Готово
    },
    K4: { cX: 300, cY: 400, inpPointX: { x: 355, y: 432 } }, // Точка готова
    K5: {
      cX: 875,
      cY: 200,
      inpPointY: { x: 894, y: 252 },
      outPointY: { x: 894, y: 196 },
      outPointX: { x: 870, y: 232 },
    },
    K6: {
      cX: 600,
      cY: 200,
      inpPointX: { x: 656, y: 232 },
      outPointX: { x: 596, y: 232 },
    }, // Точка готова
    K7: { cX: 300, cY: 200, inpPointX: { x: 355, y: 232 } }, // Точка готова
    K8: {
      // Точка готова
      cX: 875,
      cY: 10,
      inpPointY: { x: 894, y: 66 },
      outPointX: { x: 870, y: 42 },
    },
    K9: {
      // Точка готова
      cX: 600,
      cY: 10,
      outPointX: { x: 596, y: 42 }, // Готово
      inpPointX: { x: 660, y: 42 }, // Готова
    },
    K10: { cX: 300, cY: 10, inpPointX: { x: 355, y: 42 } }, // Точка готова
  };

  const VERTICAL_MOVEMENT = ["K1", "K2", "K5", "K8"];

  class ForkLifter {
    constructor(xpoint, ypoint, radius) {
      this.xpoint = xpoint;
      this.ypoint = ypoint;
      this.radius = radius;
      this.color = "blue";
    }

    draw(context) {
      context.beginPath();
      context.arc(this.xpoint, this.ypoint, this.radius, 0, Math.PI * 2, false);
      context.fillStyle = "#FFB800";
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = "black";
      context.stroke();
      context.closePath();
    }
    onClickForklift(xmouse, ymouse) {
      const distance = Math.sqrt(
        (xmouse - this.xpoint) * (xmouse - this.xpoint) +
          (ymouse - this.ypoint) * (ymouse - this.ypoint)
      );
      if (distance < this.radius) {
        setOpen(true);
        return true;
      } else {
        return false;
      }
    }
  }

  class ControlPoint {
    constructor(xpoint, ypoint, width, height, text) {
      this.xpoint = xpoint;
      this.ypoint = ypoint;
      this.width = width;
      this.height = height;
      this.text = text;
      this.lineY = ypoint;
    }
    draw(context) {
      context.beginPath();
      context.lineWidth = 4;
      context.strokeStyle = "black";
      context.strokeRect(this.xpoint, this.ypoint, this.width, this.height);
      context.fillStyle = "black";
      context.font = "bold 18px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(this.text, this.xpoint + 25, this.ypoint + 25);
      context.closePath();
      context.closePath();
    }
  }

  useEffect(() => {
    stateRef.current = props.forklift;
    setCounter(stateRef.current);
  }, [JSON.stringify(props.forklift)]);

  useEffect(() => {
    prevCountRef.current = props.forklift;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, props.width, props.height);
    context.fillStyle = "#fcf4e4";
    context.fillRect(0, 0, props.width, props.height);

    const box1 = new Box(400, 500, 250, 50, "X1");
    box1.draw(context);

    const box2 = new Box(100, 500, 250, 50, "X2");
    box2.draw(context);

    const box3 = new Box(400, 300, 250, 50, "X3");
    box3.draw(context);

    const box4 = new Box(100, 300, 250, 50, "X4");
    box4.draw(context);

    context.beginPath();
    context.moveTo(900, 550);
    context.lineWidth = 1;
    context.fillStyle = "black";
    context.lineTo(900, 35);
    context.stroke();

    context.beginPath();
    context.moveTo(900, 425);
    context.lineWidth = 1;
    context.fillStyle = "black";
    context.lineTo(325, 425);
    context.stroke();

    context.beginPath();
    context.moveTo(900, 225);
    context.lineWidth = 1;
    context.fillStyle = "black";
    context.lineTo(325, 225);
    context.stroke();

    context.beginPath();
    context.moveTo(900, 35);
    context.lineWidth = 1;
    context.fillStyle = "black";
    context.lineTo(325, 35);
    context.stroke();

    const box5 = new Box(400, 100, 250, 50, "X5");
    box5.draw(context);

    const box6 = new Box(100, 100, 250, 50, "X6");
    box6.draw(context);

    const car = new ForkLifter(
      CONTROL_PONTS[props.forklift.currentPoint].cX + 25,
      CONTROL_PONTS[props.forklift.currentPoint].cY + 25,
      20
    );
    car.draw(context);

    for (let point in CONTROL_PONTS) {
      const cp = new ControlPoint(
        CONTROL_PONTS[point].cX,
        CONTROL_PONTS[point].cY,
        50,
        50,
        point
      );
      cp.draw(context);
    }

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      car.onClickForklift(x, y);
      return () => {
        canvas.removeEventListener("click", car.onClickForklift);
      };
    });
    const isStraightPath = props.forklift.nextPNum > props.forklift.prevPNum;
    const isVertical = isStraightPath
      ? VERTICAL_MOVEMENT.includes(props.forklift.nextPoint)
      : VERTICAL_MOVEMENT.includes(props.forklift.currentPoint);
    let x = isVertical
      ? isStraightPath
        ? CONTROL_PONTS[props.forklift.currentPoint].outPointY.x // Правильно
        : CONTROL_PONTS[props.forklift.nextPoint].outPointY.x // Правильно
      : isStraightPath
      ? CONTROL_PONTS[props.forklift.currentPoint].outPointX.x
      : CONTROL_PONTS[props.forklift.nextPoint].outPointX.x;
    let y = isVertical
      ? isStraightPath
        ? CONTROL_PONTS[props.forklift.currentPoint].outPointY.y // Правильно
        : CONTROL_PONTS[props.forklift.nextPoint].outPointY.y // Правильно
      : isStraightPath
      ? CONTROL_PONTS[props.forklift.currentPoint].outPointX.y
      : CONTROL_PONTS[props.forklift.nextPoint].outPointX.y;

    let x2 = isVertical
      ? isStraightPath
        ? CONTROL_PONTS[props.forklift.nextPoint].inpPointY.x // Правильно
        : CONTROL_PONTS[props.forklift.currentPoint].inpPointY.x // Правильно
      : isStraightPath
      ? CONTROL_PONTS[props.forklift.nextPoint].inpPointX.x
      : CONTROL_PONTS[props.forklift.currentPoint].inpPointX.x; // Правильно
    let y2 = isVertical
      ? isStraightPath
        ? CONTROL_PONTS[props.forklift.nextPoint].inpPointY.y // Правильно
        : CONTROL_PONTS[props.forklift.currentPoint].inpPointY.y // Правильно
      : isStraightPath
      ? CONTROL_PONTS[props.forklift.nextPoint].inpPointX.y
      : CONTROL_PONTS[props.forklift.currentPoint].inpPointX.y;

    let yStep = isStraightPath ? y : y2;
    let startY = yStep;

    let xStep = isStraightPath ? x : x2;
    let startX = xStep;

    const draw = () => {
      const path = canvas.getContext("2d");
      if (props.forklift.nextPNum > props.forklift.prevPNum) {
        if (isVertical) {
          if (y % 6 !== 0 && y >= y2) {
            path.beginPath();
            path.moveTo(x, y);
            path.lineTo(x, y - 1);
            path.strokeStyle = "orange";
            path.lineWidth = 10;
            path.stroke();
            path.closePath();
          }

          y -= 1;
          if (y < y2 + 30) {
            yStep--;
            path.clearRect(startX - 5, yStep, 10, 1);
            path.fillStyle = "#fcf4e4";
            path.fillRect(startX - 5, yStep, 10, 1);
          }
          if (yStep < y2) {
            x = CONTROL_PONTS[props.forklift.currentPoint].outPointY.x;
            y = CONTROL_PONTS[props.forklift.currentPoint].outPointY.y;
            yStep = CONTROL_PONTS[props.forklift.currentPoint].outPointY.y;
          }
        } else {
          if (x % 6 !== 0 && x >= x2) {
            path.beginPath();
            path.moveTo(x, y);
            path.lineTo(x - 1, y);
            path.strokeStyle = "orange";
            path.lineWidth = 10;
            path.stroke();
            path.closePath();
          }
          x -= 1;

          if (x < x2 + 150) {
            xStep--;
            path.clearRect(xStep, startY - 5, 1, 10);
            path.fillStyle = "#fcf4e4";
            path.fillRect(xStep, startY - 5, 1, 10);
          }
          if (xStep < x2) {
            x = startX;
            y = startY;
            xStep = startX;
          }
        }
      } else {
        if (isVertical) {
          if (y2 % 6 !== 0 && y >= y2) {
            path.beginPath();
            path.moveTo(x2, y2);
            path.lineTo(x2, y2 + 1);
            path.strokeStyle = "orange";
            path.lineWidth = 10;
            path.stroke();
            path.closePath();
          }

          y2 += 1;
          if (y - 30 < y2) {
            yStep++;
            path.clearRect(startX - 5, yStep, 10, 1);
            path.fillStyle = "#fcf4e4";
            path.fillRect(startX - 5, yStep, 10, 1);
          }
          if (yStep > y) {
            x2 = startX;
            y2 = startY;
            yStep = startY;
          }
        } else {
          if (x2 % 6 !== 0 && x >= x2) {
            path.beginPath();
            path.moveTo(x2, y);
            path.lineTo(x2 + 1, y);
            path.strokeStyle = "orange";
            path.lineWidth = 10;
            path.stroke();
            path.closePath();
          }
          x2 += 1;

          if (x - 150 < x2) {
            xStep++;
            path.clearRect(xStep, startY - 5, 1, 10);
            path.fillStyle = "#fcf4e4";
            path.fillRect(xStep, startY - 5, 1, 10);
          }
          if (xStep >= x) {
            x2 = startX;
            y2 = startY;
            xStep = startX;
          }
        }
      }
    };

    const animationLine = () => {
      if (stateRef.current != props.forklift) return;
      draw();
      requestAnimationFrame(animationLine);
    };
    animationLine();
  }, [JSON.stringify(props.forklift)]);

  return (
    <>
      {/* {!props.forklift.id && (
        <div className="test">
          <Zoom
            background="blur"
            time={180}
            // animation="slide-right"
            color={"#ffb800"}
          />
        </div>
      )} */}

      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        style={{ border: "2px solid black", display: "flex" }}
      />
      {isOpen && (
        <ModalPopup
          closeMethod={setOpen}
          title={"Подробнее о погрузчике"}
          body={
            <>
              <div className="forklift__info">
                <div className="forklift__id"></div>
                <div className="forklift__warehouseId"></div>
              </div>
            </>
          }
        />
      )}
    </>
  );
}
