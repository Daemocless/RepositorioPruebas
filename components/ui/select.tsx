"use client";

import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

interface Option {
  value: string;
  label: string;
}

interface BaseSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  children?: ReactNode;
}

export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder = "Selecciona una opcion",
  className,
}: BaseSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={`inline-flex h-10 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100 ${className ?? ""}`}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-slate-500 dark:text-slate-300">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex h-9 cursor-pointer select-none items-center rounded-lg px-8 text-sm text-slate-800 outline-none data-[highlighted]:bg-slate-100 data-[state=checked]:bg-slate-100 dark:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[state=checked]:bg-slate-800/70"
              >
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center text-indigo-300">
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
