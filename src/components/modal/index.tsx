import classNames from "classnames";
import { MouseEventHandler } from "react";

const Modal: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({
  children,
  isOpen,
}) => {
  return (
    <div
      className={classNames(
        "fixed w-full h-full top-0 left-0 items-start justify-center",
        {
          hidden: !isOpen,
        }
      )}
    >
      <div
        id="modal"
        className="bg-white w-11/12 md:max-w-md mt-10 mx-auto rounded-2xl shadow-lg overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<{
  children: React.ReactNode;
  onClose: Function;
}> = ({ children, onClose }) => {
  const handleOnClose: MouseEventHandler<HTMLButtonElement> = (): void => {
    if (onClose) onClose();
  };
  return (
    <div id="modal-header" className="flex py-5 px-8 justify-between">
      {children}
      <button onClick={handleOnClose} className="hover:underline">
        Cancel
      </button>
    </div>
  );
};

export const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div id="modal-body" className={`${className} py-5 px-8`}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div id="modal-footer" className="py-5 px-8 flex justify-end">
      {children}
    </div>
  );
};

export default Modal;
