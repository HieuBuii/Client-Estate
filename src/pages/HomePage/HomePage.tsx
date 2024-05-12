import { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar";
import bgImg from "/images/bg.png";
import { useInview } from "../../hooks/useInView";

const HomePage = () => {
  const [years, setYears] = useState(1);
  const [award, setAward] = useState(1);
  const [property, setProperty] = useState(1);
  const targetRef = useRef<HTMLDivElement>(null);
  const idIntervalYear = useRef<NodeJS.Timeout>(null!);
  const idIntervalAward = useRef<NodeJS.Timeout>(null!);
  const idIntervalProp = useRef<NodeJS.Timeout>(null!);
  const isVisible = useInview(targetRef);

  const handleIncreaseValue = (
    initValue: number,
    setFn: React.Dispatch<React.SetStateAction<number>>,
    idInterval: React.MutableRefObject<NodeJS.Timeout>
  ) => {
    if (idInterval.current) clearInterval(idInterval.current);
    let count = 1;
    idInterval.current = setInterval(() => {
      if (count < initValue) {
        count++;
      }
      setFn(count);
    }, 300 / initValue);
  };

  useEffect(() => {
    handleIncreaseValue(16, setYears, idIntervalYear);
    handleIncreaseValue(100, setAward, idIntervalAward);
    handleIncreaseValue(500, setProperty, idIntervalProp);
  }, [isVisible]);

  return (
    <div className="flex h-full" ref={targetRef}>
      <div className="flex-3">
        <div className="flex flex-col justify-center pr-24 gap-12 h-full max-lg:pr-12 max-md:p-0 max-sm:justify-start">
          <h1
            className={`text-6xl max-sm:text-4xl max-lg:text-5xl font-bold transition duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 translate-y-0 opacity-100"
                : "-translate-x-full -translate-y-full opacity-0"
            }`}
          >
            Find Real Estate & Get Your Dream Place
          </h1>
          <p
            className={`transition duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 translate-y-0 opacity-100"
                : "-translate-x-full -translate-y-full opacity-0"
            }`}
          >
            Find the best deals on unique items at estate sales: antiques,
            kitchenware, midcentury modern furniture, power tools, decorative
            glass, china, fine art and more. Browse estate sales, auctions, and
            online auctions near you. We list sales from professional estate
            sale companies and auctioneers all over the world.
          </p>
          <div
            className={`transition duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 translate-y-0"
                : "-translate-x-full translate-y-full"
            }`}
          >
            <SearchBar />
          </div>
          <div
            className={`flex justify-between max-sm:hidden transition duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 translate-y-0"
                : "-translate-x-full translate-y-full"
            }`}
          >
            <div>
              <h1 className="text-4xl font-bold max-lg:text-3xl">
                {years >= 16 ? years + "+" : years}
              </h1>
              <h2 className="text-xl">Years of Experience</h2>
            </div>
            <div>
              <h1 className="text-4xl font-bold max-lg:text-3xl">
                {award >= 100 ? award + "+" : award}
              </h1>
              <h2 className="text-xl">Award Gained</h2>
            </div>
            <div>
              <h1 className="text-4xl font-bold max-lg:text-3xl">
                {property >= 500 ? property + "+" : property}
              </h1>
              <h2 className="text-xl">Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-2 bg-secondary relative items-center max-md:hidden">
        <img
          className={`w-[115%] absolute right-0 max-lg:w-[105%] transition duration-1000 ease-out ${
            isVisible ? "scale-100" : "-scale-0"
          }`}
          src={bgImg}
          alt="build image"
        />
      </div>
    </div>
  );
};

export default HomePage;
