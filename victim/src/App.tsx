import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import NavBar from "./components/navbar/NavBar";
import Menu from "./components/menu/Menu";
import { useState } from "react";

const center = { lat: 14.5995, lng: 120.9842 }; // Example: Manila
const position = { lat: 14.5995, lng: 120.9842 }; // Example: Manila

const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#303030" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#424242" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];
const App = () => {
  const [position, setPosition] = useState({ lat: 14.5995, lng: 120.9842 }); // Initial position (Manila)
  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_API_KEY || ""}>
        <div className="bg-[#ff5400] font-inter">
          <div className="flex justify-center items-center h-screen w-screen">
            <div className=" relative w-[25vw] h-[100vh]">
              <NavBar></NavBar>
              <Map
                styles={darkModeStyle}
                style={{ width: "100%", height: "100%" }}
                defaultCenter={center}
                defaultZoom={20}
              >
                {" "}
                <Marker
                  position={position}
                  draggable={true}
                  onDragEnd={(event) => {
                    const latLng = event.latLng;
                    if (!latLng) return; // Prevents error if latLng is null

                    const newPosition = {
                      lat: latLng.lat(),
                      lng: latLng.lng(),
                    };

                    setPosition(newPosition); // Save new position in state
                    console.log(newPosition);
                  }}
                />
              </Map>
              <Menu lat={position.lat} lng={position.lng}></Menu>
            </div>
          </div>
        </div>
      </APIProvider>
    </>
  );
};

export default App;
