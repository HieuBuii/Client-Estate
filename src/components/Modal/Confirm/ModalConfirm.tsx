import { Button, Modal } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  modalHeader: string;
  modalBody: string;
  handleCofirm: () => Promise<void>;
  isHandling: boolean;
}

export function ModalConfirm({
  modalBody,
  modalHeader,
  openModal,
  setOpenModal,
  handleCofirm,
  isHandling,
}: IProps) {
  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="md"
        className="z-[1001]"
        theme={{
          header: {
            base: "flex items-start justify-between rounded-t border-b p-2 dark:border-gray-600",
          },
          footer: {
            base: "flex items-center space-x-2 rounded-b border-gray-200 p-3 dark:border-gray-600",
          },
        }}
      >
        <Modal.Header>{modalHeader}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {modalBody}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={handleCofirm}
            isProcessing={isHandling}
            disabled={isHandling}
          >
            Accept
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
