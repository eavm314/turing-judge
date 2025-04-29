"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useModal } from "@/providers/modal-provider"
import { cn } from "@/lib/ui/utils"

export function Modal() {
  const { isOpen, modalType, options } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
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
    if (options.validator) {
      const error = options.validator(value);
      setErrors({ prompt: error });
    }
  }

  const handleConfirm = () => {
    if (Object.values(errors).some((error) => error)) {
      return;
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
    setErrors({});
  }

  const handleCancel = () => {
    options.onCancel?.();
    setInputValue("");
    setCustomInputValue(null);
    setErrors({});
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
      <DialogContent className={cn("max-w-[420px]", options.className)} onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
        </DialogHeader>

        {options.message && <DialogDescription>{options.message}</DialogDescription>}

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
            {errors.prompt && <p className="text-xs text-destructive">{errors.prompt}</p>}
          </div>
        )}

        {modalType === "custom" && CustomContent &&
          <CustomContent
            value={customInputValue}
            setValue={setCustomInputValue}
            data={options.customComponentData}
            errors={errors}
            setErrors={setErrors}
          />
        }

        <DialogFooter>
          {(modalType === "confirm" || modalType === "prompt" || modalType === "custom") && (
            <Button variant="outline" onClick={handleCancel}>
              {options.cancelLabel || "Cancel"}
            </Button>
          )}
          <Button variant={options.destructive ? "destructive" : "default"} onClick={handleConfirm}>{options.confirmLabel || "OK"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
