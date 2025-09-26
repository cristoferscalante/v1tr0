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
    <div className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Gradiente de fondo con blur - similar a los botones */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] dark:from-[#08a6961e] dark:to-[#26ffde23] rounded-full blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
        
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            "relative peer h-5 w-5 shrink-0 rounded-full border-2 border-[#08A696]/60 dark:border-[#08A696]/50 bg-white/50 dark:bg-[#08A696]/20 backdrop-blur-sm ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08A696] dark:focus-visible:ring-[#26FFDF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-md hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-110 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#08A696] data-[state=checked]:to-[#26FFDF] data-[state=checked]:border-[#26FFDF] data-[state=checked]:text-white data-[state=checked]:shadow-lg data-[state=checked]:shadow-[#08A696]/30 data-[state=checked]:scale-110",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current transition-all duration-200")}>
            <Check className="h-3 w-3 font-bold stroke-[3] drop-shadow-sm" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </div>
      
      {label && (
        <label 
          htmlFor={checkboxId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none transition-all duration-200 group-hover:text-[#08A696] dark:group-hover:text-[#26FFDF]",
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