import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { IApartment } from "../../types/apartment.types";
import { formatToDollar } from "../../utils/utils";

interface IProps {
  item: IApartment;
}

function Pin({ item }: IProps) {
  return (
    <Marker position={[item.latitute, item.longitute]}>
      <Popup>
        <div className="flex gap-5">
          <img
            className="w-16 h-12 object-cover rounded-md"
            src={item?.images ? item.images[0] : ""}
            alt=""
          />
          <div className="flex flex-col justify-between">
            <Link to={`/apartments/${item.id}`}>{item.title}</Link>
            <span>{item.bedrooms} bedroom</span>
            <b>{formatToDollar(item.price)}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
