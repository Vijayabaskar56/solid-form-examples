import type { ComponentProps } from "solid-js";
import {
	createContext,
	createMemo,
	createSignal,
	For,
	splitProps,
	useContext,
} from "solid-js";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cx } from "@/utils/utils";

export interface MultiSelectOptionItem {
	value: string;
	label?: string;
}

interface MultiSelectContextValue {
	value: () => string[];
	open: () => boolean;
	onSelect(value: string, item: MultiSelectOptionItem): void;
	onDeselect(value: string, item: MultiSelectOptionItem): void;
	disabled?: boolean;
	maxCount?: number;
	itemCache: Map<string, MultiSelectOptionItem>;
}

const MultiSelectContext = createContext<MultiSelectContextValue | undefined>(
	undefined,
);

const useMultiSelect = () => {
	const context = useContext(MultiSelectContext);
	if (!context) {
		throw new Error("useMultiSelect must be used within MultiSelectProvider");
	}
	return context;
};

type MultiSelectProps = ComponentProps<"div"> & {
	value?: string[];
	onValueChange?(value: string[]): void;
	onSelect?(value: string, item: MultiSelectOptionItem): void;
	onDeselect?(value: string, item: MultiSelectOptionItem): void;
	defaultValue?: string[];
	disabled?: boolean;
	maxCount?: number;
	children?: any;
	placeholder?: string;
};

const MultiSelect = (props: MultiSelectProps) => {
	const [, rest] = splitProps(props, [
		"value",
		"onValueChange",
		"onDeselect",
		"onSelect",
		"defaultValue",
		"disabled",
		"maxCount",
		"children",
		"placeholder",
	]);

	const itemCache = new Map<string, MultiSelectOptionItem>();
	const [open, setOpen] = createSignal(false);

	const [value, setValue] = createSignal(
		props.value || props.defaultValue || [],
	);

	const handleSelect = (selectedValue: string, item: MultiSelectOptionItem) => {
		const currentValue = value();
		if (currentValue?.includes(selectedValue)) {
			return;
		}
		props.onSelect?.(selectedValue, item);
		const newValue = [...(currentValue || []), selectedValue];
		setValue(newValue);
		props.onValueChange?.(newValue);
	};

	const handleDeselect = (
		selectedValue: string,
		item: MultiSelectOptionItem,
	) => {
		const currentValue = value();
		if (!currentValue || !currentValue.includes(selectedValue)) {
			return;
		}
		props.onDeselect?.(selectedValue, item);
		const newValue = currentValue.filter((v) => v !== selectedValue);
		setValue(newValue);
		props.onValueChange?.(newValue);
	};

	const contextValue: MultiSelectContextValue = {
		value: () => value() || [],
		open: () => open(),
		disabled: props.disabled,
		maxCount: props.maxCount,
		onSelect: handleSelect,
		onDeselect: handleDeselect,
		itemCache,
	};

	return (
		<MultiSelectContext.Provider value={contextValue}>
			<Popover open={open()} onOpenChange={setOpen}>
				<PopoverTrigger>
					<div
						aria-disabled={props.disabled}
						data-disabled={props.disabled}
						class={cx(
							"flex min-h-10 w-full items-center justify-between whitespace-nowrap rounded-sm border border-input border-dashed bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
							props.disabled ? "cursor-not-allowed opacity-50" : "cursor-text",
							rest.class,
						)}
						onClick={
							props.disabled
								? (e) => {
										e.preventDefault();
										e.stopPropagation();
									}
								: undefined
						}
						tabIndex={props.disabled ? -1 : 0}
						role="button"
					>
						<MultiSelectValue placeholder={props.placeholder} maxDisplay={3} />
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="size-4 opacity-50"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m6 9l6 6l6-6"
							/>
						</svg>
					</div>
				</PopoverTrigger>
				<PopoverContent class="w-full p-0">
					<div
						class={cx(
							"z-50 w-full rounded-sm border border-dashed bg-background p-0 text-foreground shadow-md",
							rest.class,
						)}
					>
						<div class="py-1 px-0 max-h-96 overflow-y-auto">
							<MultiSelectOptions options={props.children || []} />
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</MultiSelectContext.Provider>
	);
};

MultiSelect.displayName = "MultiSelect";

const MultiSelectValue = (props: {
	placeholder?: string;
	maxDisplay?: number;
}) => {
	const { value, itemCache, onDeselect } = useMultiSelect();
	const [firstRendered, setFirstRendered] = createSignal(false);

	const currentValue = value();
	const renderRemain =
		props.maxDisplay && currentValue.length > props.maxDisplay
			? currentValue.length - props.maxDisplay
			: 0;
	const renderItems = renderRemain
		? currentValue.slice(0, props.maxDisplay)
		: currentValue;

	// Simulate layout effect
	setTimeout(() => setFirstRendered(true), 0);

	if (!currentValue.length || !firstRendered()) {
		return (
			<span class="pointer-events-none text-muted-foreground">
				{props.placeholder}
			</span>
		);
	}

	return (
		<div class="flex flex-1 overflow-x-hidden flex-wrap items-center gap-1.5">
			<For each={renderItems}>
				{(itemValue) => {
					const item = itemCache.get(itemValue);
					const content = item?.label || itemValue;
					return (
						<div
							class="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-sm group/multi-select-badge cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDeselect(itemValue, item!);
							}}
						>
							<span>{content}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="size-3 ml-1.5 text-muted-foreground group-hover/multi-select-badge:text-foreground"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M18 6L6 18M6 6l12 12"
								/>
							</svg>
						</div>
					);
				}}
			</For>
			{renderRemain ? (
				<span class="text-muted-foreground text-xs leading-4 py-0.5">
					+{renderRemain}
				</span>
			) : null}
		</div>
	);
};

const MultiSelectList = (props: { children?: any }) => {
	return <div class="py-1 px-0 max-h-96 overflow-y-auto">{props.children}</div>;
};

const MultiSelectItem = (
	props: MultiSelectOptionItem & { children?: any; class?: string },
) => {
	const {
		value: getContextValue,
		onSelect,
		onDeselect,
		itemCache,
		maxCount,
		disabled: disabledProp,
	} = useMultiSelect();

	const contextValue = getContextValue();

	const item = createMemo(() => {
		return props.value
			? {
					value: props.value,
					label:
						props.label ||
						(typeof props.children === "string" ? props.children : undefined),
				}
			: undefined;
	}, [props.value, props.label, props.children]);

	const selected = Boolean(props.value && contextValue.includes(props.value));

	const disabled = Boolean(
		disabledProp || (!selected && maxCount && contextValue.length >= maxCount),
	);

	const handleClick = () => {
		if (selected) {
			onDeselect?.(props.value!, item()!);
		} else {
			itemCache.set(props.value!, item()!);
			onSelect?.(props.value!, item()!);
		}
	};

	return (
		<div
			class={cx(
				"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent focus:bg-accent",
				disabled && "text-muted-foreground cursor-not-allowed",
				props.class,
			)}
			onClick={!disabled ? handleClick : undefined}
			role="option"
			aria-selected={selected}
		>
			<span class="mr-2 whitespace-nowrap overflow-hidden text-ellipsis">
				{props.children || props.label || props.value}
			</span>
			{selected ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 ml-auto shrink-0"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 6L9 17l-5-5"
					/>
				</svg>
			) : null}
		</div>
	);
};

const MultiSelectGroup = (props: {
	heading?: string;
	value?: string;
	children?: any;
}) => {
	return (
		<div>
			{props.heading && (
				<div class="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
					{props.heading}
				</div>
			)}
			{props.children}
		</div>
	);
};

const MultiSelectSeparator = () => {
	return <div class="my-1 h-px bg-muted" />;
};

const MultiSelectOptions = (props: { options: MultiSelectOptionItem[] }) => {
	return (
		<>
			<For each={props.options}>
				{(option, index) => {
					if ("type" in option) {
						if (option.type === "separator") {
							return <MultiSelectSeparator />;
						}
						return null;
					}

					if ("children" in option) {
						const groupOption = option as MultiSelectOptionGroup;
						return (
							<MultiSelectGroup
								value={groupOption.value || String(index)}
								heading={groupOption.heading}
							>
								<MultiSelectOptions options={groupOption.children} />
							</MultiSelectGroup>
						);
					}

					return <MultiSelectItem {...option} />;
				}}
			</For>
		</>
	);
};

export interface MultiSelectOptionSeparator {
	type: "separator";
}

export interface MultiSelectOptionGroup {
	heading?: string;
	value?: string;
	children: MultiSelectOptionItem[];
}

export type MultiSelectOption =
	| MultiSelectOptionItem
	| MultiSelectOptionSeparator
	| MultiSelectOptionGroup;

export {
	MultiSelect,
	MultiSelectValue,
	MultiSelectList,
	MultiSelectItem,
	MultiSelectGroup,
	MultiSelectSeparator,
	MultiSelectOptions,
};
