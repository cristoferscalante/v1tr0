"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  labelClassName?: string
}

const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(({ className, label, labelClassName, id, ...props }, ref) => {
  const generatedId = React.useId()
  const checkboxId = id || generatedId
  
  return (
    <div className="flex items-center space-x-2">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded-full border-2 border-[#08A696]/50 bg-[#02505931]/50 backdrop-blur-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#26FFDF]/70 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#08A696] data-[state=checked]:to-[#26FFDF] data-[state=checked]:border-[#26FFDF] data-[state=checked]:text-black",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
          <Check className="h-3 w-3 font-bold stroke-[3]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label 
          htmlFor={checkboxId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
})

CustomCheckbox.displayName = "CustomCheckbox"

export { CustomCheckbox }