import { useState } from "react";
// @ts-ignore
import { sendSMSMessage } from "macky-sms";

const Menu = (props) => {
  const [accept, setAccept] = useState(false);
  const [color, setColor] = useState("orange");
  const [index, setIndex] = useState(0);

  const handleAcceptClick = () => {
    const newAcceptState = !accept;
    setAccept(newAcceptState);
    setColor(newAcceptState ? "green" : "orange"); // Toggle color between green and orange

    // After 3 seconds, move to the next index
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % props.toRescue.length);
      setAccept(false); // Reset accept to false when moving to next item
      setColor("orange"); // Reset color to orange
    }, 3000); // 3000ms = 3 seconds
  };

  if (!props.toRescue || props.toRescue.length === 0) {
    return <div>Loading or no data available...</div>; // Loading state or empty state
  }

  return (
    <>
      <div className="fixed bottom-0 w-full max-w-[25vw] flex flex-col items-center justify-center text-orange-500 font-bold bg-white z-10 px-8 py-4 rounded-t-4xl transition-all duration-300 ease-in-out space-y-3">
        <div className="text-black font-bold">
          <div>{props.toRescue[index].sender_name}</div>
          <div>Head Count: {props.toRescue[index].head_count}</div>
          <div>{props.toRescue[index].description}</div>
        </div>
        <div>
          <div
            className={`bg-${color}-500 text-white flex justify-center px-12 py-2 rounded-lg hover:opacity-50 transition`}
            onClick={handleAcceptClick}
          >
            {accept ? "Accepted" : "Accept"}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
