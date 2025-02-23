import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import NavBar from "./components/navbar/NavBar";
import Menu from "./components/menu/Menu";
import { useEffect, useState } from "react";
// @ts-ignore
import { sendSMSMessage } from "macky-sms";

const center = { lat: 14.5995, lng: 120.9842 }; // Example: Manila
const defaultPosition = { lat: 14.5995, lng: 120.9842 }; // Example: Manila

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
  const [position, setPosition] = useState(defaultPosition); // Initial position (Manila)
  const [sos, setSOS] = useState<any>({}); // Define sos state as any
  const [selectedMarker, setSelectedMarker] = useState<any>(null); // Track selected marker

  useEffect(() => {
    async function getList() {
      try {
        const list = await sendSMSMessage(
          import.meta.env.VITE_API_URL + "/list-sos"
        );
        console.log("SOS List fetched:", list); // Debugging the fetched list
        setSOS(list);
      } catch (error) {
        console.log("Error fetching SOS:", error);
      }
    }
    getList();
  }, []);

  const handleMarkerClick = (value: any) => {
    console.log("Marker clicked:", value); // Debugging marker click
    setSelectedMarker(value); // Set selected marker directly
  };

  const isSelected = (value: any) => {
    return (
      selectedMarker?.lat === value.lat && selectedMarker?.lng === value.lng
    );
  };

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_API_KEY || ""}>
        <div className="bg-[#ff5400] font-inter">
          <div className="flex justify-center items-center h-screen w-screen">
            <div className="relative w-[25vw] h-[100vh]">
              <NavBar />
              <Map
                styles={darkModeStyle}
                style={{ width: "100%", height: "100%" }}
                defaultCenter={center}
                defaultZoom={20}
              >
                {sos?.values &&
                  sos.values.map((value: any, index: number) => (
                    <Marker
                      key={index}
                      position={{ lat: value.lat, lng: value.lng }}
                      draggable={false}
                      onClick={() => handleMarkerClick(value)} // Set selected marker
                    >
                      {isSelected(value) && (
                        <InfoWindow
                          position={{ lat: value.lat, lng: value.lng }}
                          onCloseClick={() => setSelectedMarker(null)} // Close info window
                        >
                          <div className="bg-black text-white p-2 rounded-lg">
                            <h4>{value.sender_name}</h4>
                            <p>Sender Number: {value.sender_number}</p>
                            <p>
                              Location: Lat: {value.lat}, Lng: {value.lng}
                            </p>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
              </Map>
              <div></div>
              <Menu toRescue={sos.values} />
            </div>
          </div>
        </div>
      </APIProvider>
    </>
  );
};

export default App;
