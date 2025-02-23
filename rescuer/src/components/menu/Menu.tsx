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
      <div className="fixed bottom-0 w-full max-w-[25vw] flex flex-col items-start justify-center text-orange-500 font-bold bg-white z-10 px-6 py-4 rounded-t-4xl transition-all duration-300 ease-in-out space-y-3">
        <div className="text-black font-bold flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-12 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>

          <div>
            <div>{props.toRescue[0].sender_name}</div>
            <div>Head Count: {props.toRescue[index].head_count}</div>
            <div>{props.toRescue[0].description}</div>
          </div>
        </div>
        <div>
          <div
            className={`text-white flex justify-center px-12 py-2 rounded-lg hover:opacity-50 transition w-[22vw]`}
            style={{ backgroundColor: color === "green" ? "green" : "orange" }}
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
