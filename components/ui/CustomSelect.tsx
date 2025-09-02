'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDark?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  className = '',
  isDark = true
}: CustomSelectProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className={`
            relative w-full cursor-pointer rounded-xl py-4 px-6 text-left shadow-md
            focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2
            focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2
            focus-visible:ring-offset-orange-300 sm:text-sm transition-all duration-300
            backdrop-blur-md border-2
            ${
              isDark
                ? 'bg-gray-900/30 border-[#08A696]/30 text-[#26FFDF] hover:border-[#26FFDF]/50 focus:border-[#26FFDF] shadow-[0_0_20px_rgba(38,255,223,0.1)]'
                : 'bg-white/30 border-[#08A696]/50 text-[#08A696] hover:border-[#08A696]/70 focus:border-[#08A696] shadow-[0_0_20px_rgba(8,166,150,0.1)]'
            }
            hover:shadow-[0_0_30px_rgba(38,255,223,0.2)] focus:shadow-[0_0_30px_rgba(38,255,223,0.3)]
          `}>
            <span className="block truncate font-medium">
              {selectedOption ? selectedOption.label : (
                <span className={isDark ? 'text-[#26FFDF]/60' : 'text-[#08A696]/60'}>
                  {placeholder}
                </span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronUpDownIcon
                className={`h-5 w-5 ${isDark ? 'text-[#26FFDF]/60' : 'text-[#08A696]/60'}`}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className={`
              absolute mt-2 max-h-60 w-full overflow-auto rounded-xl py-2 text-base
              shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
              backdrop-blur-md border-2 z-50
              ${
                isDark
                  ? 'bg-gray-900/90 border-[#08A696]/30 shadow-[0_0_30px_rgba(38,255,223,0.2)]'
                  : 'bg-white/90 border-[#08A696]/50 shadow-[0_0_30px_rgba(8,166,150,0.2)]'
              }
            `}>
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 px-6 transition-all duration-200 ${
                      active
                        ? isDark
                          ? 'bg-[#26FFDF]/10 text-[#26FFDF]'
                          : 'bg-[#08A696]/10 text-[#08A696]'
                        : isDark
                        ? 'text-[#26FFDF]/80'
                        : 'text-[#08A696]/80'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate font-medium ${
                          selected ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          isDark ? 'text-[#26FFDF]' : 'text-[#08A696]'
                        }`}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}