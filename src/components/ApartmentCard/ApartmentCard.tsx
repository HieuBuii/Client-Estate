import { Link } from "react-router-dom";
import { IApartment } from "../../types/apartment.types";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { savePost } from "../../apis/post.api";
import { formatToDollar } from "../../utils/utils";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";

interface IProps {
  item: IApartment;
  isSaved?: boolean;
  handleContact?: (receiverId: string) => Promise<void>;
  setOpenModalDelete?: (postId: IApartment) => void;
  setOpenUpdatePost?: (postId: IApartment) => void;
  refetchData?: () => void;
}

const ApartmentCard = ({
  item,
  isSaved,
  handleContact,
  setOpenModalDelete,
  setOpenUpdatePost,
  refetchData,
}: IProps) => {
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(isSaved);
  const handleSavePost = async () => {
    if (currentUser && currentUser.id === item.userId) return;
    try {
      if (!item.id) return;
      const res = await savePost({ postId: item.id });
      setSaved((prev) => !prev);
      toast.success(res.message);
      refetchData && refetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = () => {
    setOpenModalDelete && setOpenModalDelete(item);
  };

  const handleUpdatePost = () => {
    setOpenUpdatePost && setOpenUpdatePost(item);
  };

  return (
    <div className="flex gap-5">
      <Link
        to={`/apartments/${item.id}`}
        className="flex-2 h-[200px] max-sm:hidden"
      >
        <img
          className="w-full h-full object-cover rounded-xl"
          src={item?.images ? item.images[0] : ""}
          alt=""
        />
      </Link>
      <div className="flex flex-col flex-3 justify-between gap-2">
        <h2 className="text-xl font-[600] text-gray-700 transition hover:text-black hover:font-bold">
          <Link to={`/apartments/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="text-sm flex items-center gap-1 text-gray-400">
          <i className="fa-solid fa-location-dot text-lg" />
          <span>{item.address}</span>
        </p>
        <p className="text-xl font-light p-1 rounded-md bg-third w-max">
          {formatToDollar(item.price)}
        </p>
        <div className="flex justify-between gap-2">
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
              <i className="fa-solid fa-bed text-sm" />
              <span>{item.bedrooms} bedroom</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
              <i className="fa-solid fa-bath text-sm" />
              <span>{item.bathrooms} bathroom</span>
            </div>
          </div>
          {!currentUser ||
            (currentUser && currentUser.id !== item.userId && (
              <div className="flex gap-5">
                <button
                  onClick={handleSavePost}
                  className={`flex-center px-1 py-[2px] rounded-md cursor-pointer hover:bg-slate-300 w-7 ${
                    saved
                      ? "bg-primary border-0"
                      : "bg-white border border-gray-500"
                  }`}
                >
                  <i className="fa-regular fa-bookmark text-sm" />
                </button>
                <button
                  onClick={() => {
                    handleContact && handleContact(item.userId);
                  }}
                  className="flex-center border-[1px] border-gray-500 px-1 py-[2px] rounded-md cursor-pointer hover:bg-slate-300 w-7"
                >
                  <i className="fa-regular fa-message text-sm" />
                </button>
              </div>
            ))}

          {currentUser && currentUser.id === item.userId && (
            <div className="flex gap-5">
              <button
                onClick={handleDeletePost}
                className="flex-center px-1 py-[2px] rounded-md cursor-pointer hover:bg-slate-300 w-7 bg-white border border-gray-500"
              >
                <HiOutlineTrash size={17} />
              </button>
              <button
                onClick={handleUpdatePost}
                className="flex-center px-1 py-[2px] rounded-md cursor-pointer hover:bg-slate-300 w-7 bg-white border border-gray-500"
              >
                <HiOutlinePencil size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;
