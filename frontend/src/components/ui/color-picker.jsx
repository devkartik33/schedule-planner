"use client";

import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { useForwardedRef } from "@/lib/use-forwarded-ref";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const ColorPicker = forwardRef(
  (
    { disabled, value, onChange, onBlur, name, className, size, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || "#3b82f6";
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn("block w-full h-12", className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size={size}
            style={{
              backgroundColor: parsedValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <div className="space-y-3">
            <HexColorPicker color={parsedValue} onChange={onChange} />
            <Input
              maxLength={7}
              onChange={(e) => {
                const val = e?.currentTarget?.value;
                if (
                  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val) ||
                  val === ""
                ) {
                  onChange(val || "#3b82f6");
                }
              }}
              ref={ref}
              value={parsedValue}
              placeholder="#3b82f6"
              className="font-mono text-sm"
            />
            {parsedValue !== "#3b82f6" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange("#3b82f6")}
                className="w-full"
              >
                Reset to Default
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
