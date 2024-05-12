import { useContext, useState, Suspense } from "react";
import ApartmentCard from "../../components/ApartmentCard";
import Chat from "../../components/Chat";
import UpdateUser from "../../components/Modal/UpdateUser";
import UserForm from "../../components/Forms/UserForm";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "/images/default-avatar.png";
import { IUser } from "../../types/user.types";
import CUApartment from "../../components/Modal/CUApartment";
import ApartmentForm from "../../components/Forms/ApartmentForm";
import {
  useLoaderData,
  Await,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { IProfilePost } from "../../apis/user.api";
import { Spinner } from "flowbite-react";
import ModalConfirm from "../../components/Modal/Confirm";
import { deletePost } from "../../apis/post.api";
import { toast } from "react-toastify";
import { IApartment } from "../../types/apartment.types";
import { createChat } from "../../apis/chat.api";
import { IConversation } from "../../components/Chat/Chat";

interface ILoaderData {
  posts: {
    data: IProfilePost;
  };
}

function Profile() {
  const navigate = useNavigate();
  const data = useLoaderData() as ILoaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useContext(AuthContext);
  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalAparmtent, setOpenModalApartment] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IApartment | null>(null);
  const [dataChat, setDataChat] = useState<IConversation>();

  const handleRefetchDataPost = () => {
    setSearchParams(searchParams.toString() + "");
  };

  const handleOpenModalDelete = (post: IApartment) => {
    setOpenModalDelete(true);
    setSelectedPost(post);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deletePost(selectedPost?.id as string);
      handleRefetchDataPost();
      toast.success(res.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      setOpenModalDelete(false);
    }
  };

  const handleCUPost = (post: IApartment | null) => {
    setOpenModalApartment(true);
    setSelectedPost(post);
  };

  const handleContact = async (receiverId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      const res = await createChat(receiverId);
      setDataChat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full max-md:flex-col max-md:overflow-auto custom-scrollbar">
      <div className="flex-3 overflow-y-auto custom-scrollbar pb-12 max-md:flex-none max-md:h-max">
        <div className="flex flex-col gap-12 pr-12">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">User Information</h1>
            <button
              className="px-6 py-3 bg-primary border-0 outline-0"
              onClick={() => setOpenModalUser(true)}
            >
              Update Profile
            </button>
          </div>
          <div className="flex flex-col gap-5">
            <span className="flex items-center gap-5">
              Avatar:
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={currentUser?.avatar || defaultAvatar}
                alt="avatar"
              />
            </span>
            <span className="flex items-center gap-5">
              Username:{" "}
              <b>{`${currentUser?.firstName} ${currentUser?.lastName}`}</b>
            </span>
            <span className="flex items-center gap-5">
              E-mail: <b>{currentUser?.email}</b>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">My List</h1>
            <button
              className="px-6 py-3 bg-primary border-0 outline-0"
              onClick={() => handleCUPost(null)}
            >
              Create New Post
            </button>
          </div>
          <Suspense
            fallback={
              <div className="flex-center">
                <Spinner color="warning" aria-label="Warning spinner example" />
              </div>
            }
          >
            <Await
              resolve={data.posts}
              errorElement={<p>Error loading posts!</p>}
            >
              {(posts: { data: IProfilePost }) => (
                <div className="flex flex-col gap-12">
                  {posts?.data?.userPosts?.length > 0 ? (
                    posts?.data?.userPosts?.map((post) => (
                      <ApartmentCard
                        key={post.id}
                        item={post}
                        setOpenModalDelete={handleOpenModalDelete}
                        setOpenUpdatePost={handleCUPost}
                      />
                    ))
                  ) : (
                    <div className="text-center text-lg mt-5">
                      No data to display
                    </div>
                  )}
                </div>
              )}
            </Await>
          </Suspense>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Saved List</h1>
          </div>
          <Suspense
            fallback={
              <div className="flex-center">
                <Spinner color="warning" aria-label="Warning spinner example" />
              </div>
            }
          >
            <Await
              resolve={data.posts}
              errorElement={<p>Error loading posts!</p>}
            >
              {(posts: { data: IProfilePost }) => (
                <div className="flex flex-col gap-12">
                  {posts?.data?.savedPosts?.length > 0 ? (
                    posts?.data?.savedPosts?.map((post) => (
                      <ApartmentCard
                        key={post.id}
                        item={post}
                        isSaved={post.isSaved}
                        refetchData={handleRefetchDataPost}
                        handleContact={handleContact}
                      />
                    ))
                  ) : (
                    <div className="text-center text-lg mt-5">
                      No data to display
                    </div>
                  )}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="flex-2 bg-secondary md:h-full h-fit max-md:flex-none overflow-hidden">
        <div className="h-full px-5">
          <Chat defaultSelected={dataChat} />
        </div>
      </div>
      <UpdateUser
        openModal={openModalUser}
        setOpenModal={setOpenModalUser}
        headerModal="Update information"
        size="2xl"
      >
        <UserForm
          data={currentUser as IUser}
          handleCloseModal={setOpenModalUser}
        />
      </UpdateUser>
      <CUApartment
        openModal={openModalAparmtent}
        setOpenModal={setOpenModalApartment}
        headerModal={selectedPost ? "Update post" : "Create post"}
        size="2xl"
      >
        <ApartmentForm
          handleCloseModal={setOpenModalApartment}
          data={selectedPost}
        />
      </CUApartment>
      <ModalConfirm
        setOpenModal={setOpenModalDelete}
        openModal={openModalDelete}
        modalHeader=""
        modalBody="Do you want delete this post?"
        handleCofirm={handleConfirmDelete}
        isHandling={isDeleting}
      />
    </div>
  );
}

export default Profile;
