'use client';

import React, { createContext, useContext, useState } from 'react';

import { Modal } from '@/components/modal';

type ModalType = 'confirm' | 'prompt' | 'custom';

export interface CustomContentProps<T, D = undefined> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  errors: Record<string, string | undefined>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>;
  data: D;
}

interface ModalOptions {
  title?: string;
  message?: string;
  validator?: (value: string) => string | undefined;
  confirmLabel?: string;
  cancelLabel?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  defaultValue?: string;
  inputType?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
  destructive?: boolean;
  className?: string;
}

interface CustomModalOptions<T, D> extends ModalOptions {
  customContent?: React.FC<CustomContentProps<T, D>>;
  onSubmit?: (value: T) => void;
  customComponentData?: D;
}

interface ModalContextType {
  isOpen: boolean;
  modalType: ModalType;
  options: CustomModalOptions<unknown, unknown>;
  showConfirm: (options: ModalOptions) => Promise<boolean>;
  showPrompt: (options: ModalOptions) => Promise<string | null>;
  showCustomModal: <T, D = undefined>(options: CustomModalOptions<T, D>) => Promise<T | null>;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('confirm');
  const [options, setOptions] = useState<CustomModalOptions<any, any>>({});

  const closeModal = () => {
    setIsOpen(false);
  };

  const showConfirm = (options: ModalOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setModalType('confirm');
      setOptions({
        className: options.className,
        title: options.title || 'Confirm',
        message: options.message || '',
        confirmLabel: options.confirmLabel || 'OK',
        cancelLabel: options.cancelLabel || 'Cancel',
        destructive: options.destructive,
        onConfirm: () => {
          closeModal();
          resolve(true);
          options.onConfirm?.();
        },
        onCancel: () => {
          closeModal();
          resolve(false);
          options.onCancel?.();
        },
      });
      setIsOpen(true);
    });
  };

  const showPrompt = (options: ModalOptions): Promise<string | null> => {
    return new Promise(resolve => {
      setModalType('prompt');
      setOptions({
        className: options.className,
        title: options.title || 'Prompt',
        message: options.message || '',
        confirmLabel: options.confirmLabel || 'OK',
        cancelLabel: options.cancelLabel || 'Cancel',
        inputLabel: options.inputLabel,
        inputPlaceholder: options.inputPlaceholder || '',
        defaultValue: options.defaultValue || '',
        inputType: options.inputType || 'text',
        validator: options.validator,
        onConfirm: value => {
          closeModal();
          resolve(value!);
          options.onConfirm?.(value);
        },
        onCancel: () => {
          closeModal();
          resolve(null);
          options.onCancel?.();
        },
      });
      setIsOpen(true);
    });
  };

  const showCustomModal = <T, D>(options: CustomModalOptions<T, D>): Promise<T | null> => {
    return new Promise(resolve => {
      setModalType('custom');
      setOptions({
        className: options.className,
        title: options.title || 'Custom Modal',
        confirmLabel: options.confirmLabel || 'OK',
        cancelLabel: options.cancelLabel || 'Cancel',
        customContent: options.customContent,
        customComponentData: options.customComponentData,
        onSubmit: (value: T) => {
          closeModal();
          resolve(value as T);
          options.onSubmit?.(value);
        },
        onCancel: () => {
          closeModal();
          resolve(null);
          options.onCancel?.();
        },
      });
      setIsOpen(true);
    });
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        options,
        showConfirm,
        showPrompt,
        showCustomModal,
        closeModal,
      }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
