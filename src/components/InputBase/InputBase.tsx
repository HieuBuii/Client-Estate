import { Label, TextInput } from "flowbite-react";
import { HTMLInputTypeAttribute, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  field: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  label: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const InputBase = ({
  register,
  errors,
  field,
  placeholder,
  type,
  label,
  required,
  disabled,
  className,
}: IProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <div className={className}>
      <div className="mb-2 block">
        <Label htmlFor={field} value={label} />
      </div>
      <div className="relative">
        <TextInput
          id={field}
          type={
            type
              ? type === "password"
                ? isShowPassword
                  ? "text"
                  : "password"
                : type
              : "text"
          }
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          shadow
          theme={{
            field: {
              input: {
                sizes: {
                  md: `p-2.5 text-sm ${type === "password" && "pr-12"}`,
                },
              },
            },
          }}
          {...register(field, { valueAsNumber: type === "number" })}
          color={errors[field] && "failure"}
          helperText={
            errors[field] && (
              <>
                <span className="font-medium">
                  {(errors[field]?.message as string) || ""}
                </span>
              </>
            )
          }
        />
        {type === "password" && (
          <i
            onClick={() => {
              setIsShowPassword((prev) => !prev);
            }}
            className={`fa-solid ${
              isShowPassword ? "fa-eye" : "fa-eye-slash"
            } cursor-pointer absolute top-[14px] right-4`}
          />
        )}
      </div>
    </div>
  );
};

export default InputBase;
