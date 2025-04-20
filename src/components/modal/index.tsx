"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useModal } from "@/providers/modal-provider"

export function Modal() {
  const { isOpen, modalType, options } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [customInputValue, setCustomInputValue] = useState<unknown>(null);

  useEffect(() => {
    if (isOpen && modalType === "prompt") {
      setInputValue(options.defaultValue || "");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100)
    }
  }, [isOpen, modalType, options.defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (options.validator && errorMessage !== undefined) {
      const error = options.validator(value);
      setErrorMessage(error);
    }
  }

  const handleConfirm = () => {
    if (options.validator) {
      const error = options.validator(inputValue);
      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    if (modalType === "custom") {
      options.onSubmit?.(customInputValue);
    } else if (modalType === "prompt") {
      options.onConfirm?.(inputValue);
    } else {
      options.onConfirm?.();
    }
    
    setInputValue("");
    setCustomInputValue(null);
    setErrorMessage(undefined);
  }

  const handleCancel = () => {
    options.onCancel?.();
    setInputValue("");
    setCustomInputValue(null);
    setErrorMessage(undefined);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && modalType !== "custom") {
      e.preventDefault();
      handleConfirm();
    }
  }

  const CustomContent = options.customContent;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
        </DialogHeader>

        {options.message && <p className="text-sm text-muted-foreground">{options.message}</p>}

        {modalType === "prompt" && (
          <div>
            {options.inputLabel && (
              <Label htmlFor="modal-input" className="text-left font-light">
                {options.inputLabel}
              </Label>
            )}
            <Input
              id="modal-input"
              ref={inputRef}
              type={options.inputType || "text"}
              placeholder={options.inputPlaceholder}
              value={inputValue}
              onChange={handleInputChange}
              className="my-1"
            />
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
          </div>
        )}

        {modalType === "custom" && CustomContent &&
          <CustomContent value={customInputValue} setValue={setCustomInputValue} data={options.customComponentData} />
        }

        <DialogFooter>
          <Button onClick={handleConfirm}>{options.confirmLabel || "OK"}</Button>
          {(modalType === "confirm" || modalType === "prompt" || modalType === "custom") && (
            <Button variant="outline" onClick={handleCancel}>
              {options.cancelLabel || "Cancel"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
