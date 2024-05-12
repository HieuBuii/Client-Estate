import { Spinner } from "flowbite-react";
import { ReactNode, useEffect, useRef } from "react";

interface IProps {
  children: ReactNode;
  fetchData: () => void;
  isLoading: boolean;
  hasMore: boolean;
  className: string;
  hideEnd?: boolean;
}

const InfiniteScroll = ({
  children,
  fetchData,
  isLoading,
  hasMore,
  className,
  hideEnd,
}: IProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        hasMore && fetchData();
      }
    });

    if (loaderRef?.current) {
      observer.observe(loaderRef?.current);
    }

    return () => {
      if (loaderRef?.current) {
        observer.unobserve(loaderRef?.current);
      }
    };
  }, [fetchData, hasMore]);

  return (
    <div className={className}>
      {children}
      <div ref={loaderRef} className="flex-center">
        {isLoading && (
          <Spinner color="warning" aria-label="Warning spinner example" />
        )}
        {!hasMore && !hideEnd && (
          <p className="text-sm">No more post to display</p>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
