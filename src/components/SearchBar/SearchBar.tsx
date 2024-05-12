import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ISearchForm } from "../../types/filer.types";

const SearchBar = () => {
  const navigate = useNavigate();
  const TYPES = useMemo(() => {
    return ["buy", "rent"];
  }, []);

  const { register, setValue, watch, handleSubmit } = useForm<ISearchForm>({
    defaultValues: {
      type: "buy",
      location: "",
      minPrice: 0,
      maxPrice: 10000000,
    },
  });

  const onSubmit: SubmitHandler<ISearchForm> = (values) => {
    let query = "?";
    let path = "/apartments";
    const valuesWithIndex = values as ISearchForm & {
      [key: string]: string | number;
    };
    for (const key in valuesWithIndex) {
      if (valuesWithIndex[key]) {
        query += `${key}=${valuesWithIndex[key]}&`;
      }
    }
    if (query.length > 1) path += query.slice(0, query.length - 1);
    navigate(path);
  };

  return (
    <div>
      <div>
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setValue("type", type as "buy" | "rent")}
            className={`${
              watch("type") === type ? "bg-black text-white" : "bg-white"
            } px-9 py-4 border-solid border-[1px] border-gray-400 border-b-0 capitalize first:rounded-tl-md first:border-r-0 last:rounded-tr-md last:border-l-0`}
          >
            {type}
          </button>
        ))}
      </div>
      <form
        className="border-[1px] border-gray-400 flex justify-center sm:h-16 gap-1 max-sm:flex-col max-sm:border-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="input-search"
          type="text"
          placeholder="City Location"
          {...register("location")}
        />
        <input
          className="input-search"
          type="number"
          min={0}
          max={10000000}
          placeholder="Min Price"
          {...register("minPrice")}
        />
        <input
          className="input-search"
          type="number"
          min={0}
          max={10000000}
          placeholder="Max Price"
          {...register("maxPrice")}
        />
        <button className="border-0 cursor-pointer bg-primary flex-1 max-sm:p-2">
          <i className="fa-solid fa-magnifying-glass text-white text-2xl" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
