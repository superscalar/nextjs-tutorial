'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();
	
	const handleSearch = useDebouncedCallback((term) => {
	  console.log(`Searching... ${term}`);
	 
	  const params = new URLSearchParams(searchParams);
	  params.set('page', '1');
	  
	  if (term) {
		params.set('query', term);
	  } else {
		params.delete('query');
	  }
	  replace(`${pathname}?${params.toString()}`);
	}, 300);
	
	/*
	const handleSearch = (searchTerm: string) => {
		console.log(searchTerm);
		const params = new URLSearchParams(searchParams);
		if (searchTerm != "") {
			params.set('query', searchTerm);
		} else {
			params.delete('query');
		}
		
		// the original pathname is implicit
		replace(`${pathname}?${params.toString()}`);
	};
	*/

	/* isn't onChange very inefficient? one query per keystroke and even if mistakes happen, backspace resends queries */
	// it is covered later - they recommend use-debounce, which is solving a problem that they themselves created, but it does work
	// though it feels like using the normal html controls is better
	
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
		onChange={(e) => {
			handleSearch(e.target.value);
		}}
		defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
