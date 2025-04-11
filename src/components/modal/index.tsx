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

  const handleConfirm = () => {
    if (modalType === "custom") {
      options.onSubmit?.(customInputValue);
    } else if (modalType === "prompt") {
      options.onConfirm?.(inputValue);
    } else {
      options.onConfirm?.();
    }
  }

  const handleCancel = () => {
    options.onCancel?.();
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
          <div className="grid gap-4 py-4">
            {options.inputLabel && (
              <Label htmlFor="modal-input" className="text-left">
                {options.inputLabel}
              </Label>
            )}
            <Input
              id="modal-input"
              ref={inputRef}
              type={options.inputType || "text"}
              placeholder={options.inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-3"
            />
          </div>
        )}

        {modalType === "custom" && CustomContent &&
          <CustomContent value={customInputValue} setValue={setCustomInputValue} />
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
