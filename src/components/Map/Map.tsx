import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Pin from "../Pin";
import { IApartment } from "../../types/apartment.types";

interface IProps {
  items: IApartment[];
}

function Map({ items }: IProps) {
  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitute, items[0].longitute]
          : [21.0278, 105.8342]
      }
      zoom={7}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
