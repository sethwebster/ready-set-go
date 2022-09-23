import React from "react";
import { useState, useCallback, useEffect } from "react";
import { getRandomArbitrary } from "../helpers/get-random-arbitrary";

function StopLight({
  color,
  onClick,
  children,
}: {
  onClick?: () => void;
  color: "gray" | "red" | "yellow" | "green";
  children?: React.ReactNode;
}) {
  const map = {
    gray: "bg-gray-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  } as { [key: string]: string };

  const actualColor = map[color];

  return (
    <div
      className={`${actualColor} w-1/2 p-1/2 mb-5 rounded-full shadow-md`}
      onClick={onClick}
    >
      <div className="w-full h-full relative">{children}</div>
    </div>
  );
}

export default function StopLights() {
  const [colorState, setColorState] = useState({
    red: false,
    yellow: false,
    green: false,
  });
  // const [redActive, setRedActive] = useState(false);
  // const [yellowActive, setYellowActive] = useState(false);
  // const [greenActive, setGreenActive] = useState(false);
  const [timeActive, setTimeActive] = useState(-1);
  const [timeClicked, setTimeClicked] = useState(-1);
  const [inPlay, setInPlay] = useState(false);

  const resetPlay = useCallback(() => {
    setTimeActive(-1);
    setTimeClicked(-1);
    setColorState({ red: false, yellow: false, green: false });
    setInPlay(false);
  }, []);

  const handleClick = useCallback(() => {
    if (colorState.green) {
      if (timeClicked >= 0) return;
      setTimeClicked(new Date().getTime());
      setInPlay(false);
    } else {
      alert("Too Early, Pal.");
      resetPlay();
    }
  }, [colorState.green, resetPlay, timeClicked]);

  const handleStartOrReset = useCallback(() => {
    if (inPlay) {
      resetPlay();
    } else {
      setInPlay(true);
    }
  }, [inPlay, resetPlay]);

  useEffect(() => {
    if (!inPlay) return;
    const delay = getRandomArbitrary(3000, 15000);
    console.log("Delay", delay);

    let redTimer: NodeJS.Timer;
    const red = new Promise<void>((resolve) => {
      redTimer = setTimeout(() => {
        setColorState((colors) => ({ ...colors, red: true }));
        resolve();
      }, 100);
    });

    let yellowTimer: NodeJS.Timer;
    const yellow = new Promise<void>((resolve) => {
      yellowTimer = setTimeout(() => {
        setColorState((colors) => ({ ...colors, yellow: true }));
        resolve();
      }, 2000);
    });

    let greenTimer: NodeJS.Timer;
    const green = new Promise<void>((resolve) => {
      greenTimer = setTimeout(() => {
        setColorState((colors) => ({ ...colors, green: true }));
        setTimeActive(new Date().getTime());
        resolve();
      }, delay);
    });

    red.then(() => yellow.then(() => green.then()));

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleClick();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => {
      console.log("Destroy");
      clearTimeout(redTimer);
      clearTimeout(yellowTimer);
      clearTimeout(greenTimer);
      window.removeEventListener("keydown", handleEnter);
    };
  }, [handleClick, inPlay]);

  const redColor = colorState.red ? "red" : "gray";
  const yellowColor = colorState.yellow ? "yellow" : "gray";
  const greenColor = colorState.green ? "green" : "gray";

  return (
    <>
      <div className="flex flex-col">
        <div className="w-48 m-auto h-auto flex flex-col">
          <StopLight color={colorState.red ? "red" : "gray"} />
          <StopLight color={colorState.yellow ? "yellow" : "gray"} />
          <StopLight
            color={colorState.green ? "green" : "gray"}
            onClick={handleClick}
          >
            <div className="absolute -left-8 -top-28 m-auto ">
              {timeClicked >= 0 && (
                <div className="text-4xl pt-24 text-center text-green-300">
                  {timeClicked - timeActive}
                </div>
              )}
              {colorState.green && timeClicked < 0 && (
                <div className="text-4xl pt-24 text-center text-green-300">
                  GO!
                </div>
              )}
            </div>
          </StopLight>
        </div>
        <button
          onClick={handleStartOrReset}
          className="text-2xl bg-amber-100 w-20 m-auto rounded-md"
        >
          {inPlay || timeClicked >= 0 ? "Reset" : "Start"}
        </button>
      </div>
    </>
  );
}
