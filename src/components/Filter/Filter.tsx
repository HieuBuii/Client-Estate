import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { ISearchForm } from "../../types/filer.types";

interface IProps {
  handleFilter: () => void;
}

const Filter = ({ handleFilter }: IProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, handleSubmit } = useForm<ISearchForm>({
    defaultValues: {
      ...Object.fromEntries(searchParams),
      ...(searchParams
        ? {
            minPrice: parseInt(searchParams.get("minPrice") || "") || undefined,
            maxPrice: parseInt(searchParams.get("maxPrice") || "") || undefined,
            bedrooms: parseInt(searchParams.get("bedrooms") || "") || undefined,
          }
        : {}),
    },
  });

  const onSubmit: SubmitHandler<ISearchForm> = (values) => {
    let query = "";
    const valuesWithIndex = values as ISearchForm & {
      [key: string]: string | number;
    };
    for (const key in valuesWithIndex) {
      if (valuesWithIndex[key]) {
        query += `${key}=${valuesWithIndex[key]}&`;
      }
    }
    setSearchParams(query);
    handleFilter();
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">
        Search results for <b>{searchParams.get("location")}</b>
      </h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="filter-item">
          <label className="text-xs" htmlFor="city">
            Location
          </label>
          <input
            className="input-filter !w-full"
            type="text"
            placeholder="City Location"
            {...register("location")}
          />
        </div>

        <div className="flex flex-wrap justify-between gap-5">
          <div className="filter-item">
            <label className="text-xs" htmlFor="type">
              Type
            </label>
            <select className="input-filter" {...register("type")}>
              <option value="">Any</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="filter-item">
            <label className="text-xs" htmlFor="property">
              Property
            </label>
            <select className="input-filter" {...register("property")}>
              <option value="">Any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div className="filter-item">
            <label className="text-xs" htmlFor="minPrice">
              Min Price
            </label>
            <input
              className="input-filter"
              type="number"
              placeholder="Min price"
              min={0}
              max={10000000}
              {...register("minPrice", { valueAsNumber: true })}
            />
          </div>
          <div className="filter-item">
            <label className="text-xs" htmlFor="maxPrice">
              Max Price
            </label>
            <input
              className="input-filter"
              type="text"
              placeholder="Max price"
              min={0}
              max={10000000}
              {...register("maxPrice", { valueAsNumber: true })}
            />
          </div>
          <div className="filter-item">
            <label className="text-xs" htmlFor="bedroom">
              Bedroom
            </label>
            <input
              className="input-filter"
              type="text"
              placeholder="Bedroom"
              {...register("bedrooms", { valueAsNumber: true })}
            />
          </div>
          <button className="w-[100px] p-3 border-0 outline-0 bg-primary rounded-md">
            <i className="fa-solid fa-magnifying-glass text-white text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filter;
