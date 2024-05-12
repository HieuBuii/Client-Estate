import { Params, defer } from "react-router-dom";
import { getPost, getPosts } from "../../apis/post.api";
import { getProfilePosts } from "../../apis/user.api";

export const loadDataPost = async ({ params }: { params: Params<"id"> }) => {
  try {
    const { id } = params;
    if (id) {
      const res = await getPost(id);
      return res.data;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const loadDataListPost = async ({ request }: { request: Request }) => {
  try {
    const query = request.url.split("?")[1];
    const postPromise = getPosts(query ? "?" + query : "");
    return defer({
      posts: postPromise,
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const loadProfileListPost = async () => {
  try {
    const postPromise = getProfilePosts();
    return defer({
      posts: postPromise,
    });
  } catch (error) {
    console.log(error);
    return {};
  }
};
