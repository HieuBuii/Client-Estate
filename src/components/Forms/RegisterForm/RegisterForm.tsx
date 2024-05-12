import { Button, Label, Radio } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputBase from "../../InputBase/InputBase";
import { useContext, useState } from "react";
import { IRegister, registerSchema } from "../../../schemas/registerSchema";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../../apis/auth.api";
import { AuthContext } from "../../../context/AuthContext";

const RegisterForm = () => {
  const { updateCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IRegister>({
    defaultValues: {
      gender: "m",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<IRegister> = async (values) => {
    setIsUpdating(true);
    try {
      const data: Partial<IRegister | "confirmPassword"> = { ...values };
      delete data.confirmPassword;
      const res = await registerApi(data);
      reset();
      res.data && updateCurrentUser(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col max-sm:mt-4 max-w-[650px]">
      <strong className="text-4xl text-center">Register</strong>
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
          className="sm:w-[49%] w-full mb-3"
          type="password"
          field="password"
          errors={errors}
          label="Password"
          register={register}
          placeholder="Enter your password"
        />
        <InputBase
          className="sm:w-[49%] w-full mb-3"
          type="password"
          field="confirmPassword"
          errors={errors}
          label="Confirm password"
          register={register}
          placeholder="Enter confirm password"
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
        <p className="mt-2">
          Already have account?
          <Link className="text-blue-600 font-bold" to="/login">
            {" "}
            Login
          </Link>
        </p>
        <div className="w-full">
          <Button
            className="max-sm:w-full bg-primary text-black float-right"
            type="submit"
            isProcessing={isUpdating}
            disabled={isUpdating}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
