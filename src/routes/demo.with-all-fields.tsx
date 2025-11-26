import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	CalendarCell,
	CalendarCellTrigger,
	CalendarLabel,
	CalendarNav,
	CalendarTable,
} from "@/components/ui/calender";
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import { Input, Textarea } from "@/components/ui/input";
import { MultiSelect, MultiSelectItem } from "@/components/ui/multi-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch, SwitchControl, SwitchThumb } from "@/components/ui/switch";
import { useAppForm } from "@/components/ui/tanstack-form";

const allFieldsFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	message: z.string().min(1, "Message is required"),
	agree: z.boolean().refine((val) => val === true, "You must agree to terms"),
	datePicker: z.string().min(1, "Date is required"),
	otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
	multiSelect: z.array(z.string()).min(1, "Select at least one option"),
	radioGroup: z.string().min(1, "Select one option"),
	select: z.string().min(1, "Select an option"),
	slider: z
		.number()
		.min(1, "Value must be at least 1")
		.max(100, "Value must be at most 100"),
	switch: z.boolean(),
	toggleGroup: z.array(z.string()).min(1, "Select at least one day"),
});

export const Route = createFileRoute("/demo/with-all-fields")({
	component: RouteComponent,
});

function RouteComponent() {
	const allFieldsForm = useAppForm(() => ({
		defaultValues: {
			name: "",
			email: "",
			message: "",
			agree: false,
			datePicker: "",
			otp: "",
			multiSelect: [] as string[],
			radioGroup: "",
			select: "",
			slider: 50,
			switch: false,
			toggleGroup: [] as string[],
		} as z.input<typeof allFieldsFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: allFieldsFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: () => {
			toast.success("Form submitted successfully!");
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"]!;
			const inputs = Array.from(
				document.querySelectorAll("input, textarea, select"),
			) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];
			let firstInput:
				| HTMLInputElement
				| HTMLTextAreaElement
				| HTMLSelectElement
				| undefined;
			for (const input of inputs) {
				if (errorMap[input.name]) {
					firstInput = input;
					break;
				}
			}
			firstInput?.focus();
		},
	}));

	const radioOptions = [
		{ label: "Option 1", value: "1" },
		{ label: "Option 2", value: "2" },
		{ label: "Option 3", value: "3" },
	];

	const selectOptions = [
		{ label: "Option 1", value: "1" },
		{ label: "Option 2", value: "2" },
	];

	const multiSelectOptions = [
		{ label: "Option 1", value: "1" },
		{ label: "Option 2", value: "2" },
		{ label: "Option 3", value: "3" },
		{ label: "Option 4", value: "4" },
		{ label: "Option 5", value: "5" },
	];

	const toggleGroupOptions = [
		{ label: "Mon", value: "monday" },
		{ label: "Tue", value: "tuesday" },
		{ label: "Wed", value: "wednesday" },
		{ label: "Thu", value: "thursday" },
		{ label: "Fri", value: "friday" },
		{ label: "Sat", value: "saturday" },
		{ label: "Sun", value: "sunday" },
	];

	return (
		<div class="p-8 max-w-2xl mx-auto">
			<allFieldsForm.AppForm>
				<allFieldsForm.Form>
					<allFieldsForm.FieldLegend class="text-3xl font-bold">
						All Fields Form
					</allFieldsForm.FieldLegend>
					<allFieldsForm.FieldDescription>
						This form demonstrates all available UI components
					</allFieldsForm.FieldDescription>
					<allFieldsForm.FieldSeparator />

					{/* Name and Email Row */}
					<div class="flex flex-col sm:flex-row gap-4">
						<allFieldsForm.AppField name={"name"}>
							{(field) => (
								<field.FieldSet class="flex-1">
									<field.Field>
										<field.FieldLabel for={"name"}>Name *</field.FieldLabel>
										<Input
											name={"name"}
											placeholder="Enter your name"
											value={(field().state.value as string | undefined) ?? ""}
											onBlur={field().handleBlur}
											onInput={(e) =>
												field().handleChange(e.currentTarget.value)
											}
											aria-invalid={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
											}
										/>
									</field.Field>
									<field.FieldError />
								</field.FieldSet>
							)}
						</allFieldsForm.AppField>

						<allFieldsForm.AppField name={"email"}>
							{(field) => (
								<field.FieldSet class="flex-1">
									<field.Field>
										<field.FieldLabel for={"email"}>Email *</field.FieldLabel>
										<Input
											name={"email"}
											type="email"
											placeholder="Enter your email"
											value={(field().state.value as string | undefined) ?? ""}
											onBlur={field().handleBlur}
											onInput={(e) =>
												field().handleChange(e.currentTarget.value)
											}
											aria-invalid={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
											}
										/>
									</field.Field>
									<field.FieldError />
								</field.FieldSet>
							)}
						</allFieldsForm.AppField>
					</div>

					{/* Message Textarea */}
					<allFieldsForm.AppField name={"message"}>
						{(field) => (
							<field.FieldSet>
								<field.Field>
									<field.FieldLabel for={"message"}>Message *</field.FieldLabel>
									<Textarea
										name={"message"}
										placeholder="Enter your message"
										value={(field().state.value as string | undefined) ?? ""}
										onBlur={field().handleBlur}
										onInput={(e) => field().handleChange(e.currentTarget.value)}
										class="resize-none"
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									/>
								</field.Field>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Checkbox Agreement */}
					<allFieldsForm.AppField name={"agree"}>
						{(field) => (
							<field.FieldSet>
								<field.Field orientation="horizontal">
									<Checkbox
										checked={Boolean(field().state.value)}
										onChange={(checked) =>
											field().handleChange(checked as boolean)
										}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									>
										<CheckboxControl />
									</Checkbox>
									<field.FieldContent>
										<field.FieldLabel
											class="space-y-1 leading-none"
											for={"agree"}
										>
											I agree to terms and conditions *
										</field.FieldLabel>
										<field.FieldError />
									</field.FieldContent>
								</field.Field>
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Simple Date Input for now */}
					<allFieldsForm.AppField name={"datePicker"}>
						{(field) => {
							const fieldValue = field().state.value;
							return (
								<field.FieldSet class="flex flex-col w-full">
									<field.Field>
										<field.FieldLabel for={"datePicker"}>
											Pick a date *
										</field.FieldLabel>
										<Popover>
											<PopoverTrigger>
												<Button
													variant={"outline"}
													class={`w-full justify-start text-start font-normal ${
														!fieldValue && "text-muted-foreground"
													}`}
													aria-invalid={
														!!field().state.meta.errors.length &&
														field().state.meta.isTouched
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="mr-2 size-4"
														viewBox="0 0 24 24"
														fill="none"
													>
														<path
															stroke="currentColor"
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
													{fieldValue ? (
														new Date(fieldValue).toLocaleDateString("en-US", {
															weekday: "long",
															year: "numeric",
															month: "long",
															day: "numeric",
														})
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent class="w-auto p-0">
												<Calendar
													mode="single"
													value={fieldValue ? new Date(fieldValue) : undefined}
													onValueChange={(newDate) => {
														field().handleChange(
															newDate?.toISOString() as string,
														);
													}}
												>
													{(calendarProps) => (
														<>
															<CalendarNav action="prev-month" />
															<CalendarLabel />
															<CalendarNav action="next-month" />
															<CalendarTable>
																<thead>
																	<tr>
																		<For each={calendarProps.weekdays}>
																			{(weekday) => (
																				<th class="p-2 text-sm font-medium text-center">
																					{typeof weekday === "string"
																						? weekday
																						: weekday.toLocaleDateString(
																								"en-US",
																								{ weekday: "short" },
																							)}
																				</th>
																			)}
																		</For>
																	</tr>
																</thead>
																<tbody>
																	<For each={calendarProps.weeks}>
																		{(week) => (
																			<tr>
																				<For each={week}>
																					{(day) => (
																						<CalendarCell>
																							<CalendarCellTrigger day={day} />
																						</CalendarCell>
																					)}
																				</For>
																			</tr>
																		)}
																	</For>
																</tbody>
															</CalendarTable>
														</>
													)}
												</Calendar>
											</PopoverContent>
										</Popover>

										<field.FieldError />
									</field.Field>
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					{/* OTP Input */}
					<allFieldsForm.AppField name={"otp"}>
						{(field) => (
							<field.FieldSet>
								<field.Field>
									<field.FieldLabel for={"otp"}>
										One-Time Password *
									</field.FieldLabel>
									<Input
										name={"otp"}
										placeholder="Enter 6-digit OTP"
										maxLength={6}
										value={(field().state.value as string | undefined) ?? ""}
										onBlur={field().handleBlur}
										onInput={(e) => field().handleChange(e.currentTarget.value)}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									/>
								</field.Field>
								<field.FieldDescription>
									Please enter the one-time password sent to your phone.
								</field.FieldDescription>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Radio Group */}
					<allFieldsForm.AppField name={"radioGroup"}>
						{(field) => (
							<field.FieldSet class="flex flex-col gap-2 py-1">
								<field.FieldLabel class="mt-0" for={"radioGroup"}>
									Pick one option *
								</field.FieldLabel>
								<field.Field>
									<div class="space-y-2">
										{radioOptions.map(({ label, value }) => (
											<label class="flex items-center gap-2">
												<input
													type="radio"
													name="radioGroup"
													value={value}
													checked={(field().state.value as string) === value}
													onChange={() => field().handleChange(value)}
													aria-invalid={
														!!field().state.meta.errors.length &&
														field().state.meta.isTouched
													}
												/>
												{label}
											</label>
										))}
									</div>
								</field.Field>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Select Dropdown */}
					<allFieldsForm.AppField name={"select"}>
						{(field) => (
							<field.FieldSet>
								<field.Field>
									<field.FieldLabel
										class="flex justify-between items-center"
										for={"select"}
									>
										Select option *
									</field.FieldLabel>
								</field.Field>
								<select
									value={(field().state.value as string | undefined) ?? ""}
									onChange={(e) => field().handleChange(e.currentTarget.value)}
									aria-invalid={
										!!field().state.meta.errors.length &&
										field().state.meta.isTouched
									}
									class="w-full p-2 border rounded-md"
								>
									<option value="">Select item</option>
									{selectOptions.map(({ label, value }) => (
										<option value={value}>{label}</option>
									))}
								</select>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Slider */}
					<allFieldsForm.AppField name={"slider"}>
						{(field) => {
							const currentValue = field().state.value as number;
							return (
								<field.FieldSet>
									<field.Field>
										<field.FieldLabel
											class="flex justify-between items-center"
											for={"slider"}
										>
											Set Range *
											<span class="text-sm text-muted-foreground">
												{currentValue} / 100
											</span>
										</field.FieldLabel>
										<input
											type="range"
											min="1"
											max="100"
											value={currentValue}
											onInput={(e) => {
												field().handleChange(Number(e.currentTarget.value));
												field().handleBlur();
											}}
											aria-invalid={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
											}
											class="w-full"
										/>
									</field.Field>
									<field.FieldDescription class="py-1">
										Adjust the range by sliding.
									</field.FieldDescription>
									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					{/* Switch */}
					<allFieldsForm.AppField name={"switch"}>
						{(field) => (
							<field.FieldSet class="flex flex-col p-3 justify-center w-full border rounded">
								<field.Field orientation="horizontal">
									<field.FieldContent>
										<field.FieldLabel for={"switch"}>
											Toggle Switch
										</field.FieldLabel>
										<field.FieldDescription>
											Turn on or off.
										</field.FieldDescription>
									</field.FieldContent>
									<Switch
										checked={Boolean(field().state.value)}
										onChange={(checked) => {
											field().handleChange(checked);
											field().handleBlur();
										}}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									>
										<SwitchControl>
											<SwitchThumb />
										</SwitchControl>
									</Switch>
								</field.Field>
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Toggle Group for Days */}
					<allFieldsForm.AppField name={"toggleGroup"}>
						{(field) => (
							<field.FieldSet class="flex flex-col gap-2 py-1">
								<field.Field>
									<field.FieldLabel class="mt-0" for={"toggleGroup"}>
										Pick multiple days *
									</field.FieldLabel>
									<div class="flex flex-wrap gap-2">
										{toggleGroupOptions.map(({ label, value }) => (
											<button
												type="button"
												class={`px-3 py-2 border rounded-md ${
													(field().state.value as string[]).includes(value)
														? "bg-primary text-primary-foreground"
														: "bg-background"
												}`}
												onClick={() => {
													const currentValue = field().state.value as string[];
													if (currentValue.includes(value)) {
														field().handleChange(
															currentValue.filter((v) => v !== value),
														);
													} else {
														field().handleChange([...currentValue, value]);
													}
												}}
											>
												{label}
											</button>
										))}
									</div>
								</field.Field>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Multi-select using custom component */}
					<allFieldsForm.AppField name={"multiSelect"}>
						{(field) => (
							<field.FieldSet>
								<field.Field>
									<field.FieldLabel for={"multiSelect"}>
										Select multiple options *
									</field.FieldLabel>
									<MultiSelect
										value={(field().state.value as string[]) || []}
										onValueChange={field().handleChange}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									>
										{multiSelectOptions.map(({ label, value }) => (
											<MultiSelectItem value={value}>{label}</MultiSelectItem>
										))}
									</MultiSelect>
								</field.Field>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					{/* Submit Buttons */}
					<div class="flex justify-end items-center w-full pt-3 gap-3">
						<allFieldsForm.Subscribe
							selector={(state) => !state.isDefaultValue}
						>
							{(isNotDefault) => (
								<Show when={isNotDefault()}>
									<Button
										type="button"
										onClick={() => allFieldsForm.reset()}
										class="rounded-lg"
										variant="outline"
										size="sm"
									>
										Reset
									</Button>
								</Show>
							)}
						</allFieldsForm.Subscribe>
						<allFieldsForm.SubmitButton label="Submit" />
					</div>
				</allFieldsForm.Form>
			</allFieldsForm.AppForm>
		</div>
	);
}
