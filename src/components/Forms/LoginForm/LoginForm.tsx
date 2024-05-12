import { Button } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputBase from "../../InputBase/InputBase";
import { useContext, useState } from "react";
import { ILogin, loginSchema } from "../../../schemas/registerSchema";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../apis/auth.api";
import { AuthContext } from "../../../context/AuthContext";

const LoginForm = () => {
  const { updateCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILogin> = async (values) => {
    setIsUpdating(true);
    try {
      const res = await loginApi(values);
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
    <div className="flex flex-col max-sm:mt-4 max-sm:h-screen max-w-md">
      <strong className="text-4xl text-center">Login</strong>
      <form
        className="flex w-full justify-between flex-wrap"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputBase
          className="w-full mb-3"
          field="email"
          type="email"
          errors={errors}
          label="Email"
          register={register}
          placeholder="Enter your email"
        />
        <InputBase
          className="w-full mb-3"
          type="password"
          field="password"
          errors={errors}
          label="Password"
          register={register}
          placeholder="Enter your password"
        />
        <p className="mt-2">
          Don't have account?
          <Link className="text-blue-600 font-bold" to="/register">
            {" "}
            Sign up
          </Link>
        </p>
        <div className="w-full">
          <Button
            className="max-sm:w-full bg-primary text-black float-right"
            type="submit"
            isProcessing={isUpdating}
            disabled={isUpdating}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
