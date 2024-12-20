'use client'

import { cn } from '@lib/utils/cn'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@components/ui/input'
import { useDebouncedValue } from '@lib/hooks/useDebounce'

const inputClasses = cn(
  'min-w-14 md:max-w-72 appearance-none rounded-md border py-2 pl-4 pr-10 md:pl-2 md:pr-8 lg:pl-4 lg:pr-10 transition-opacity inline-block',
)

export const SearchInputPlaceholder = ({ placeholder }: { placeholder: string }) => {
  return (
    <Input
      className={cn('pointer-events-none', inputClasses)}
      placeholder={placeholder}
      type="search"
      aria-busy
      aria-disabled
    />
  )
}
export const SearchInput = ({ placeholder }: { placeholder: string }) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const searchParamQuery = searchParams.get("q") ?? "";
	const [query, setQuery] = useState(searchParamQuery);
	const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 100);

	useEffect(() => {
		router.prefetch(`/shop/search?q=${encodeURIComponent(query)}`);
	}, [query, router]);

	useEffect(() => {
		if (debouncedQuery) {
      // const params = new URLSearchParams(searchParams)
      // params.set('q', encodeURIComponent(debouncedQuery))
			router.push(`/shop/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
		}
	}, [debouncedQuery, router]);

  // if the pathname is /shop/search and the query is empty, redirect to /shop
	useEffect(() => {
		if (pathname === "/shop/search" && !query) {
			router.push(`/shop`, { scroll: true });
		}
	}, [pathname, query, router]);

  // if the pathname is not /shop/search, set the query to empty
	useEffect(() => {
		if (pathname !== "/shop/search") {
			setQuery("");
		}
	}, [pathname]);

	return (
		<Input
			onChange={(e) => {
				const query = e.target.value;
				setQuery(query);
			}}
			// className={inputClasses}
			placeholder={placeholder}
			type="search"
			enterKeyHint="search"
			name="search"
			value={query}
		/>
	);
};




