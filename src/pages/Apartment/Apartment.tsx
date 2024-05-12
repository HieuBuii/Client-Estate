import { useLoaderData, useNavigate } from "react-router-dom";
import Map from "../../components/Map/Map";
import Slider from "../../components/Slider";
import { IApartment } from "../../types/apartment.types";
import { savePost } from "../../apis/post.api";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "/images/default-avatar.png";
import { Tooltip } from "flowbite-react";
import { formatToDollar } from "../../utils/utils";

function Apartment() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const data = useLoaderData() as IApartment;
  const [saved, setSaved] = useState(data.isSaved);

  const handleSavePost = async () => {
    if (!currentUser) navigate("/login");
    try {
      if (!data.id) return;
      const res = await savePost({ postId: data.id });
      setSaved((prev) => !prev);
      toast.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-full max-md:flex-col overflow-auto custom-scrollbar">
      <div className="flex-3 h-full overflow-auto max-md:flex-none max-md:h-max max-md:mb-12">
        <div className="pr-12 max-lg:pr-5 max-md:pr-0">
          <Slider images={data.images ? data.images : []} />
          <div className="mt-12">
            <div className="flex justify-between max-sm:flex-col gap-5">
              <div className="flex flex-col gap-5">
                <h1 className="font-normal text-3xl">{data.title}</h1>
                <div className="flex gap-1 items-center text-gray-400 text-sm">
                  <i className="fa-solid fa-location-dot text-lg" />
                  <span>{data.address}</span>
                </div>
                <div className="text-xl font-light p-1 rounded-md bg-third w-max">
                  {formatToDollar(data.price)}
                </div>
              </div>
              <div className="flex-center flex-col gap-3 px-12 rounded-xl bg-third font-semibold max-sm:px-12 sm:py-5">
                <img
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  src={data?.user?.avatar || defaultAvatar}
                  alt=""
                />
                <span>
                  {`${data?.user?.firstName} ${data?.user?.lastName}` || ""}
                </span>
                <Tooltip
                  content={data?.user?.phoneNumber || ""}
                  placement="bottom"
                >
                  <span>
                    {data?.user?.phoneNumber &&
                    data?.user?.phoneNumber?.length > 13
                      ? data?.user?.phoneNumber.substring(0, 12) + "..."
                      : data?.user?.phoneNumber}
                  </span>
                </Tooltip>
              </div>
            </div>
            <div className="mt-12 text-gray-600 text-sm">{data.desc}</div>
          </div>
        </div>
      </div>
      <div className="flex-2 bg-[#fcf5f3] h-full overflow-y-auto max-md:flex-none max-md:h-max max-md:mb-12 custom-scrollbar">
        <div className="flex flex-col gap-5 px-5 max-md:p-5">
          <p className="font-bold text-lg mb-2">General</p>
          <div className="flex flex-col gap-5 px-2 py-5 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-screwdriver-wrench text-lg" />
              <div>
                <span className="font-bold">Utilities</span>
                <p className="text-sm">{data.utilities}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-paw text-lg" />
              <div>
                <span className="font-bold">Pet Policy</span>
                <p className="text-sm">{data.pet}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-coins text-lg" />
              <div>
                <span className="font-bold">Property Fees</span>
                <p className="text-sm">{data.income}</p>
              </div>
            </div>
          </div>
          <p className="font-bold text-lg mb-2">Sizes</p>
          <div className="flex justify-between max-lg:text-[12px]">
            <div className="flex items-center gap-2 bg-white p-2 rounded-md">
              <i className="fa-solid fa-up-right-and-down-left-from-center text-lg"></i>
              <span>{`${data.size} sqft`}</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-md">
              <i className="fa-solid fa-bed text-lg"></i>
              <span>{`${data.bedrooms} beds`}</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-md">
              <i className="fa-solid fa-bath text-lg"></i>
              <span>{`${data.bathrooms} bathrooms`}</span>
            </div>
          </div>
          <p className="font-bold text-lg mb-2">Nearby Places</p>
          <div className="flex justify-between px-2 py-5 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-school text-lg"></i>
              <div>
                <span className="font-bold">School</span>
                <p className="text-sm">{`${
                  data.school && data.school > 999
                    ? data.school / 1000 + "km"
                    : data.school + "m"
                } away`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bus text-lg"></i>
              <div>
                <span className="font-bold">Bus Stop</span>
                <p className="text-sm">{`${
                  data.bus && data.bus > 999
                    ? data.bus / 1000 + "km"
                    : data.bus + "m"
                } away`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-utensils text-lg"></i>
              <div>
                <span className="font-bold">Restaurant</span>
                <p className="text-sm">{`${
                  data.restaurant && data.restaurant > 999
                    ? data.restaurant / 1000 + "km"
                    : data.restaurant + "m"
                } away`}</p>
              </div>
            </div>
          </div>
          <p className="font-bold text-lg mb-2">Location</p>
          <div className="w-full h-[200px]">
            <Map items={[data]} />
          </div>
          <div className="flex justify-between">
            <button className="px-5 py-3 border bg-white border-gray-200 rounded-md m-5">
              <i className="fa-regular fa-message text-sm mr-2"></i>
              Send a Message
            </button>
            <button
              className={`px-5 py-3 border border-gray-200 rounded-md m-5 ${
                saved ? "bg-primary" : "bg-white"
              }`}
              onClick={handleSavePost}
            >
              <i className="fa-regular fa-bookmark text-sm mr-2"></i>
              {saved ? "Post Saved" : "Save the Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Apartment;
