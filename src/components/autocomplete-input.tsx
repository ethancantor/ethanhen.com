'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronsUpDownIcon, PlusIcon } from 'lucide-react'

export default function AutocompleteInput({ folders, folderState }: { folders: string[], folderState: [string, Dispatch<SetStateAction<string>>] }) {
  const [query, setQuery] = useState('');
  const [folder, setFolder] = folderState;

  const filteredSuggestions =
    query === ''
      ? folders
      : folders.filter((item) =>
          item.toLowerCase().includes(query?.toLowerCase() || '')
        )

  const handleChange = (value: string) => {
    setFolder(value)
    setQuery(value)
  }

  return (
      <Combobox value={folder} onChange={handleChange}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-zinc-800 text-left shadow-md focus:outline-none focus-visible:ring-0 sm:text-sm">
            <ComboboxInput
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-white focus:ring-0 focus:outline-none"
              displayValue={(item: string) => item}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Add Photo to Album"
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDownIcon
                className="h-5 w-5 text-zinc-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredSuggestions.length === 0 && query !== '' ? (
              <ComboboxOption
                value={query}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 text-white ${
                    active && 'bg-zinc-600 '
                  }`
                }
              >
                {({ active }) => (
                  <>
                    <span className="block truncate font-medium">
                      Create &quot;{query}&quot;
                    </span>
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 text-white ${
                        active && 'bg-zinc-600 '
                      }`}
                    >
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </>
                )}
              </ComboboxOption>
            ) : (
              filteredSuggestions.map((item) => (
                <ComboboxOption
                  key={item}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-white ${
                      active && 'bg-zinc-600 '
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item}
                      </span>
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
  )
}