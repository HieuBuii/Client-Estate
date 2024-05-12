import { Modal, Flowbite, CustomFlowbiteTheme } from "flowbite-react";

interface IProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  headerModal?: string;
  children: React.ReactNode;
  refAutoFocus?: React.RefObject<HTMLInputElement>;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
}

const customTheme: CustomFlowbiteTheme = {
  modal: {
    content: {
      base: "relative h-auto w-full p-4",
    },
    header: {
      title: "font-bold text-xl text-gray-900 dark:text-white",
      popup: "border-b-0 p-3",
    },
  },
};

export default function CUApartment({
  openModal,
  setOpenModal,
  headerModal,
  children,
  refAutoFocus,
  size,
}: IProps) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Modal
        show={openModal}
        size={size || "md"}
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={refAutoFocus}
        dismissible
        className="z-[9999]"
      >
        <Modal.Header>{headerModal}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </Flowbite>
  );
}
