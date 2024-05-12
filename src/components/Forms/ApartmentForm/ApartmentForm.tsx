import { useState } from "react";
import { Button, Label, Select, Textarea } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputBase from "../../InputBase/InputBase";
import { toast } from "react-toastify";
import UploadWidget from "../../UploadWidget";
import { IApartment } from "../../../types/apartment.types";
import { apartmentSchema } from "../../../schemas/apartmentSchema";
import { createPost, updatePost } from "../../../apis/post.api";
import { useNavigate } from "react-router-dom";

interface IProps {
  data?: IApartment | null;
  handleCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApartmentForm = ({ data, handleCloseModal }: IProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(data?.images || []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    values: data ? data : ({} as IApartment),
    resolver: zodResolver(apartmentSchema),
  });

  const onSubmit: SubmitHandler<IApartment> = async (values) => {
    setIsSubmitting(true);
    try {
      let postId = "";
      const dataSubmit = { ...values, images: images ? images : values.images };
      if (data) {
        delete dataSubmit.id;
        const res = await updatePost(dataSubmit, data?.id as string);
        toast.success(res.message);
        postId = data?.id as string;
      } else {
        const res = await createPost(dataSubmit);
        toast.success(res.message);
        postId = res.data?.id as string;
      }
      handleCloseModal(false);
      reset();
      navigate(`/apartments/${postId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = (link: string) => {
    console.log(images, link);
    const newImage = images.filter((image) => image !== link);
    setImages(newImage);
  };

  console.log(getValues());

  return (
    <form
      className="flex w-full justify-between flex-wrap"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="title"
        errors={errors}
        label="Title"
        register={register}
        placeholder="Enter title"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="price"
        type="number"
        errors={errors}
        label="Price (USD)"
        register={register}
        placeholder="Enter price"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="city"
        errors={errors}
        label="City"
        register={register}
        placeholder="Enter city"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="bedrooms"
        type="number"
        errors={errors}
        label="Bedroom"
        register={register}
        placeholder="Enter number of bedroom"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="bathrooms"
        type="number"
        errors={errors}
        label="Bathroom"
        register={register}
        placeholder="Enter number of bathroom"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="address"
        errors={errors}
        label="Address"
        register={register}
        placeholder="Enter your address"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="latitute"
        errors={errors}
        label="Latitute"
        register={register}
        placeholder="Enter latitute"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="longitute"
        errors={errors}
        label="Longitute"
        register={register}
        placeholder="Enter longitute"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="utilities"
        errors={errors}
        label="Utilities"
        register={register}
        placeholder="Enter utilities"
      />
      <div className="sm:w-[49%] w-full mb-3">
        <div className="mb-2 block">
          <Label value="Pet policy" />
        </div>
        <Select
          {...register("pet")}
          required
          color={errors.pet && "failure"}
          helperText={
            errors.pet && (
              <>
                <span className="font-medium">
                  {(errors.pet?.message as string) || ""}
                </span>
              </>
            )
          }
        >
          <option value={"allowed"}>Allowed</option>
          <option value={"not allowed"}>Not allowed</option>
        </Select>
      </div>
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="income"
        errors={errors}
        label="Income"
        register={register}
        placeholder="Enter income"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="size"
        type="number"
        errors={errors}
        label="Size (sqft)"
        register={register}
        placeholder="Enter area"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="school"
        type="number"
        errors={errors}
        label="Distance to school (m)"
        register={register}
        placeholder="Enter distance to school"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="bus"
        type="number"
        errors={errors}
        label="Distance to bus stop (m)"
        register={register}
        placeholder="Enter distance to bus stop"
      />
      <InputBase
        className="sm:w-[49%] w-full mb-3"
        field="restaurant"
        type="number"
        errors={errors}
        label="Distance to restaurant (m)"
        register={register}
        placeholder="Enter distance to restaurant"
      />
      <div className="sm:w-[49%] w-full mb-3">
        <div className="mb-2 block">
          <Label value="Property" />
        </div>
        <Select
          {...register("property")}
          required
          color={errors.property && "failure"}
          helperText={
            errors.property && (
              <>
                <span className="font-medium">
                  {(errors.property?.message as string) || ""}
                </span>
              </>
            )
          }
        >
          <option value={"apartment"}>Apartment</option>
          <option value={"house"}>House</option>
          <option value={"condo"}>Condo</option>
          <option value={"land"}>Land</option>
        </Select>
      </div>
      <div className="sm:w-[49%] w-full mb-3">
        <div className="mb-2 block">
          <Label value="Type" />
        </div>
        <Select
          {...register("type")}
          required
          color={errors.type && "failure"}
          helperText={
            errors.type && (
              <>
                <span className="font-medium">
                  {(errors.type?.message as string) || ""}
                </span>
              </>
            )
          }
        >
          <option value={"buy"}>Buy</option>
          <option value={"rent"}>Rent</option>
        </Select>
      </div>
      <div className="sm:w-[49%] w-full mb-3">
        <div className="mb-2 block">
          <Label value="Status" />
        </div>
        <Select
          {...register("status")}
          required
          color={errors.status && "failure"}
          helperText={
            errors.status && (
              <>
                <span className="font-medium">
                  {(errors.status?.message as string) || ""}
                </span>
              </>
            )
          }
        >
          <option value={"available"}>Available</option>
          <option value={"wasRented"}>Was rented</option>
        </Select>
      </div>
      <div className="w-full mb-3">
        <div className="mb-2 block">
          <Label value="Description" />
        </div>
        <Textarea
          {...register("desc")}
          placeholder="Enter description"
          rows={4}
          className="resize-none"
        />
      </div>
      <div className="w-full flex gap-1 flex-wrap mb-5 items-center">
        <div className="block w-full">
          <Label htmlFor="file" value="Images" />
        </div>
        <div className="flex gap-4 overflow-x-auto custom-scrollbar mb-3 w-full">
          {images.map((image) => (
            <div className="relative">
              <img
                className="h-52 object-cover"
                key={image}
                src={image}
                alt="image"
              />
              <i
                className="fa-solid fa-times absolute top-0 right-0 text-lg cursor-pointer px-2 rounded-full border bg-white"
                onClick={() => handleRemoveImage(image)}
              />
            </div>
          ))}
        </div>

        <div className="w-full">
          <UploadWidget
            uwConfig={{
              cloudName: "hswebdev",
              uploadPreset: "estate",
              multiple: true,
              maxImageFileSize: 2000000,
              folder: "post",
            }}
            setState={setImages}
          />
        </div>
      </div>
      <div className="w-full">
        <Button
          className="max-sm:w-full bg-primary text-black float-right"
          type="submit"
          isProcessing={isSubmitting}
        >
          {data ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default ApartmentForm;
