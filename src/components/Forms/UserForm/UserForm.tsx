import { useContext, useState } from "react";
import { Button, Label, Radio } from "flowbite-react";
import { IUser } from "../../../types/user.types";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../../schemas/userSchema";
import InputBase from "../../InputBase/InputBase";
import defaultAvatar from "/images/default-avatar.png";
import { updateUser } from "../../../apis/user.api";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import UploadWidget from "../../UploadWidget";

interface IProps {
  data: IUser;
  handleCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserForm = ({ data, handleCloseModal }: IProps) => {
  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: data,
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<IUser> = async (values) => {
    setIsUpdating(true);
    try {
      const dataUpdate = { ...values };
      if (newAvatar.length > 0) dataUpdate.avatar = newAvatar[0];
      if (currentUser?.id) {
        const res = await updateUser(dataUpdate, currentUser.id);
        handleCloseModal(false);
        if (res.data) updateCurrentUser(res.data);
        toast.success(res.message);
        reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form
      className="flex w-full justify-between flex-wrap"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="email"
        type="email"
        errors={errors}
        label="Email"
        register={register}
        disabled
        placeholder="Enter your email"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="phoneNumber"
        errors={errors}
        label="Phone number"
        register={register}
        placeholder="Enter your phone number"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="firstName"
        errors={errors}
        label="First name"
        register={register}
        placeholder="Enter your first name"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="lastName"
        errors={errors}
        label="Last name"
        register={register}
        placeholder="Enter your last name"
      />
      <InputBase
        className="w-full mb-3"
        field="address"
        errors={errors}
        label="Address"
        register={register}
        placeholder="Enter your address"
      />
      <fieldset className="flex w-full gap-4 mb-2">
        <legend className="mb-1 text-sm">Gender</legend>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Radio
              id="m"
              className="cursor-pointer"
              {...register("gender")}
              value="m"
            />
            <Label className="cursor-pointer" htmlFor="m">
              Male
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="f"
              className="cursor-pointer"
              {...register("gender")}
              value="f"
            />
            <Label className="cursor-pointer" htmlFor="f">
              Famale
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="o"
              className="cursor-pointer"
              {...register("gender")}
              value="o"
            />
            <Label className="cursor-pointer" htmlFor="o">
              Other
            </Label>
          </div>
        </div>
      </fieldset>
      <div className="w-full flex gap-1 flex-wrap mb-5 items-center">
        <div className="block w-full">
          <Label htmlFor="file" value="Avatar" />
        </div>
        <div className="w-full flex-center mb-2">
          <img
            className="w-28 h-28 rounded-full object-cover"
            src={newAvatar[0] || data.avatar || defaultAvatar}
            alt="avatar"
          />
        </div>
        <div className="w-full flex-center">
          <UploadWidget
            uwConfig={{
              cloudName: "hswebdev",
              uploadPreset: "estate",
              multiple: false,
              maxImageFileSize: 2000000,
              folder: "avatar",
            }}
            setState={setNewAvatar}
          />
        </div>
      </div>
      <div className="w-full">
        <Button
          className="max-sm:w-full bg-primary text-black float-right"
          type="submit"
          isProcessing={isUpdating}
        >
          Save change
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
