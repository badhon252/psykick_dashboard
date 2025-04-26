import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type logoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({ isOpen, onClose, onConfirm }: logoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-black leading-normal">Are you sure you want to delete this Image Gallry ?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="w-full flex items-center !justify-center gap-7 mt-5">
          <button
            className="text-white bg-red-500 py-[8px] px-6 text-sm font-medium leading-[120%] rounded-[8px]"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="text-base font-medium bg-green-600 text-white leading-[120%] py-[8px] px-[18px] rounded-lg shadow-none border-none"
            onClick={onClose}
          >
            No
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
