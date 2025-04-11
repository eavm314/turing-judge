"use client"

import { createContext, useContext, useState } from "react";

import { Modal } from "@/components/modal";

type ModalType = "alert" | "confirm" | "prompt" | "custom";

interface CustomContentProps {
  value: any
  onChange: (value: any) => void
}

interface ModalOptions {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  inputLabel?: string
  inputPlaceholder?: string
  defaultValue?: string
  inputType?: string
  customContent?: React.FC<CustomContentProps>
  onConfirm?: (value?: any) => void
  onCancel?: () => void
};

interface ModalContextType {
  isOpen: boolean
  modalType: ModalType
  options: ModalOptions
  showAlert: (options: ModalOptions) => Promise<void>
  showConfirm: (options: ModalOptions) => Promise<boolean>
  showPrompt: (options: ModalOptions) => Promise<string | null>
  showCustomModal: <T>(options: ModalOptions) => Promise<T | null>
  closeModal: () => void
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("alert");
  const [options, setOptions] = useState<ModalOptions>({});

  const closeModal = () => {
    setIsOpen(false);
  }

  const showAlert = (options: ModalOptions): Promise<void> => {
    return new Promise((resolve) => {
      setModalType("alert");
      setOptions({
        title: options.title || "Alert",
        message: options.message || "",
        confirmLabel: options.confirmLabel || "OK",
        onConfirm: () => {
          closeModal()
          resolve()
          options.onConfirm?.()
        },
      });
      setIsOpen(true);
    })
  }

  const showConfirm = (options: ModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalType("confirm");
      setOptions({
        title: options.title || "Confirm",
        message: options.message || "",
        confirmLabel: options.confirmLabel || "OK",
        cancelLabel: options.cancelLabel || "Cancel",
        onConfirm: () => {
          closeModal()
          resolve(true)
          options.onConfirm?.()
        },
        onCancel: () => {
          closeModal()
          resolve(false)
          options.onCancel?.()
        },
      });
      setIsOpen(true);
    });
  }

  const showPrompt = (options: ModalOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalType("prompt");
      setOptions({
        title: options.title || "Prompt",
        message: options.message || "",
        confirmLabel: options.confirmLabel || "OK",
        cancelLabel: options.cancelLabel || "Cancel",
        inputLabel: options.inputLabel,
        inputPlaceholder: options.inputPlaceholder || "",
        defaultValue: options.defaultValue || "",
        inputType: options.inputType || "text",
        onConfirm: (value) => {
          closeModal()
          resolve(value)
          options.onConfirm?.(value)
        },
        onCancel: () => {
          closeModal()
          resolve(null)
          options.onCancel?.()
        },
      });
      setIsOpen(true);
    });
  }

  const showCustomModal = <T,>(options: ModalOptions): Promise<T | null> => {
    return new Promise((resolve) => {
      setModalType("custom");
      setOptions({
        title: options.title || "Custom Modal",
        confirmLabel: options.confirmLabel || "OK",
        cancelLabel: options.cancelLabel || "Cancel",
        customContent: options.customContent,
        onConfirm: (value) => {
          closeModal()
          resolve(value as T)
          options.onConfirm?.(value)
        },
        onCancel: () => {
          closeModal()
          resolve(null)
          options.onCancel?.()
        },
      });
      setIsOpen(true);
    });
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        options,
        showAlert,
        showConfirm,
        showPrompt,
        showCustomModal,
        closeModal,
      }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
