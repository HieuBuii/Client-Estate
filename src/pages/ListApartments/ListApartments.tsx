import { useSearchParams } from "react-router-dom";
import ApartmentCard from "../../components/ApartmentCard";
import Filter from "../../components/Filter";
import Map from "../../components/Map/Map";
import { IApartment } from "../../types/apartment.types";
import { useCallback, useState } from "react";
import ModalConfirm from "../../components/Modal/Confirm";
import { deletePost, getPosts } from "../../apis/post.api";
import { toast } from "react-toastify";
import CUApartment from "../../components/Modal/CUApartment";
import ApartmentForm from "../../components/Forms/ApartmentForm";
import InfiniteScroll from "../../components/InfiniteScroll";
import { createChat } from "../../apis/chat.api";
import { IConversation } from "../../components/Chat/Chat";
import MessageBox from "../../components/MessageBox";

const ListPage = () => {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IApartment | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginate, setPaginate] = useState({ page: 1, perPage: 10 });
  const [dataPost, setDataPost] = useState<IApartment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedChat, setSelectedChat] = useState<IConversation>();

  const getDataPosts = useCallback(
    async (searchParams: string) => {
      setIsLoading(true);
      const res = await getPosts(searchParams);
      if (
        (dataPost.length > 0 && dataPost.length >= (res?.total ?? 0)) ||
        res.data?.length === 0
      )
        setHasMore(false);
      setDataPost((prev) => [...prev, ...(res.data || [])]);
      setIsLoading(false);
    },
    [dataPost]
  );

  const fetchMore = useCallback(() => {
    if (isLoading) return;
    searchParams.set("page", paginate.page.toString());
    searchParams.set("perPage", paginate.perPage.toString());
    setSearchParams(searchParams);
    getDataPosts("?" + searchParams.toString());
    setPaginate((prev) => ({ ...prev, page: prev.page + 1 }));
  }, [paginate, getDataPosts, isLoading, searchParams, setSearchParams]);

  const handleOpenModalDelete = (post: IApartment) => {
    setOpenModalDelete(true);
    setSelectedPost(post);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deletePost(selectedPost?.id as string);
      toast.success(res.message);
      const newDataPost = dataPost.filter(
        (post) => post.id !== selectedPost?.id
      );
      setDataPost(newDataPost);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      setOpenModalDelete(false);
    }
  };

  const handleOpenModalUpdate = (post: IApartment | null) => {
    setOpenModalUpdate(true);
    setSelectedPost(post);
  };

  const handleFilter = useCallback(() => {
    setPaginate((prev) => ({ ...prev, page: 1 }));
    setDataPost([]);
    setHasMore(true);
  }, []);

  const handleContact = async (receiverId: string) => {
    try {
      const res = await createChat(receiverId);
      setSelectedChat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-3 h-full">
        <div className="pr-12 mb-6">
          <Filter handleFilter={handleFilter} />
        </div>
        <InfiniteScroll
          fetchData={fetchMore}
          isLoading={isLoading}
          hasMore={hasMore}
          className="flex flex-col max-lg:h-[calc(100%-265px)] h-[calc(100%-190px)] pr-12 gap-12 pb-12 overflow-y-auto custom-scrollbar"
        >
          {dataPost?.length > 0 &&
            dataPost?.map((post) => (
              <ApartmentCard
                key={post.id}
                item={post}
                setOpenModalDelete={() => handleOpenModalDelete(post)}
                setOpenUpdatePost={handleOpenModalUpdate}
                isSaved={post.isSaved}
                handleContact={handleContact}
              />
            ))}
          {!isLoading && dataPost?.length === 0 && (
            <div className="text-center text-lg mt-5">No data to display</div>
          )}
        </InfiniteScroll>
      </div>
      <div className="flex-2 h-full bg-secondary max-md:hidden relative">
        <Map items={dataPost} />
        {selectedChat && (
          <MessageBox
            dataChat={selectedChat}
            setDataChat={setSelectedChat}
            handleClose={() => setSelectedChat(undefined)}
          />
        )}
      </div>
      <div className="hidden max-md:block">
        {selectedChat && (
          <MessageBox
            dataChat={selectedChat}
            setDataChat={setSelectedChat}
            handleClose={() => setSelectedChat(undefined)}
          />
        )}
      </div>
      <CUApartment
        openModal={openModalUpdate}
        setOpenModal={setOpenModalUpdate}
        headerModal="Update post"
        size="2xl"
      >
        <ApartmentForm
          handleCloseModal={setOpenModalUpdate}
          data={selectedPost}
        />
      </CUApartment>
      <ModalConfirm
        setOpenModal={setOpenModalDelete}
        openModal={openModalDelete}
        modalHeader="Delete confirm"
        modalBody="Do you want delete this post?"
        handleCofirm={handleConfirmDelete}
        isHandling={isDeleting}
      />
    </div>
  );
};

export default ListPage;
