import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoveltyPopupProps {
  open: boolean;
  onClose: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  title?: string;
  size?: "max-w-md" | "max-w-xl" | "max-w-2xl" | "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl";
  OnPrimary: () => void;
  children?: ReactNode;
}

const NoveltyPopup = ({ open, onClose, primaryButtonText, secondaryButtonText, title, size, OnPrimary, children }: NoveltyPopupProps) => {
  return (
    <Dialog 
    open={open} 
    onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent className={`${size || "max-w-md"} max-h-[90vh] overflow-y-auto`}>
        <div className="space-y-4 rounded-lg border-1 border-gray-150 bg-muted/30 p-4 sm:p-5">
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
          </DialogHeader>
          {children}
          <DialogFooter className="border-t pt-4">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
              <Button 
              variant="tertiary" 
              onClick={onClose}>
                {secondaryButtonText}
              </Button>
              <Button onClick={OnPrimary}>
                {primaryButtonText}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NoveltyPopup
