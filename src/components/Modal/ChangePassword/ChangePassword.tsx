import { Button, Modal } from "flowbite-react";
import { useContext, useState } from "react";
import InputBase from "../../InputBase/InputBase";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IUpdatePassword,
  updatePasswordSchema,
} from "../../../schemas/userSchema";
import { updateUser } from "../../../apis/user.api";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

interface IProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChangePassword({ openModal, setOpenModal }: IProps) {
  const { currentUser } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdatePassword>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit: SubmitHandler<IUpdatePassword> = async (values) => {
    setIsUpdating(true);
    try {
      const dataUpdate = {
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
      };
      const res = await updateUser(dataUpdate, currentUser?.id as string);
      setOpenModal(false);
      toast.success(res.message);
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Change your password</Modal.Header>
        <Modal.Body>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <InputBase
              className="w-full"
              field="currentPassword"
              type="password"
              errors={errors}
              label="Current password"
              register={register}
              placeholder="Enter current password"
            />
            <InputBase
              className="w-full"
              field="newPassword"
              type="password"
              errors={errors}
              label="New password"
              register={register}
              placeholder="Enter new password"
            />
            <InputBase
              className="w-full"
              field="confirmPassword"
              type="password"
              errors={errors}
              label="Confirm password"
              register={register}
              placeholder="Enter confirm password"
            />

            <div className="w-full">
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:!bg-primaryHover"
                isProcessing={isUpdating}
                disabled={isUpdating}
              >
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
