import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { Calendar as CalendarIcon, Eye, EyeOff } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import { Checkbox, CheckboxControl, CheckboxInput } from "@/components/ui/checkbox";
import { Input, Textarea } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	OTPField,
	OTPFieldGroup,
	OTPFieldInput,
	OTPFieldSeparator,
	OTPFieldSlot,
} from "@/components/ui/input-otp";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectList,
	MultiSelectSearch,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	RadioGroup,
	RadioGroupItem,
	RadioGroupItemControl,
	RadioGroupItemIndicator,
	RadioGroupItemInput,
	RadioGroupItemLabel,
} from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider, SliderFill, SliderGroup, SliderLabel, SliderThumb, SliderTrack, SliderValueLabel } from "@/components/ui/slider";
import { Switch, SwitchControl, SwitchInput, SwitchThumb } from "@/components/ui/switch";
import { useAppForm } from "@/components/ui/tanstack-form";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cx } from "@/utils/utils";

const allFieldsFormSchema = z.object({
	name: z.string().min(1, "This field is required"),
	email: z.string().email("Invalid email address"),
	message: z.string().min(1, "This field is required"),
	agree: z.boolean().refine((val) => val === true, "You must agree to the terms"),
	DatePicker_1764134690674: z.string().min(1, "This field is required"),
	OTP_1764134693138: z.string().min(6, "OTP must be 6 digits"),
	Password_1764134695746: z.string().min(1, "This field is required"),
	RadioGroup_1764134697946: z.string().min(1, "This field is required"),
	Select_1764134704537: z.string().min(1, "This field is required"),
	Slider_1764134707426: z.number().min(1),
	Switch_1764134711186: z.boolean(),
	ToggleGroup_1764134722041: z.array(z.string()).min(1, "Select at least one option"),
	MultiSelect_1764134723000: z.array(z.string()).min(1, "Select at least one option"),
});

// Simple date formatter (replacement for date-fns format)
function formatDate(date: Date): string {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const month = months[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();
	return `${month} ${day}, ${year}`;
}

export const Route = createFileRoute("/demo/with-all-fields")({
	component: RouteComponent,
});

function RouteComponent() {
	const [showPassword, setShowPassword] = createSignal(false);

	const allFieldsForm = useAppForm(() => ({
		defaultValues: {
			name: "",
			email: "",
			message: "",
			agree: false,
			DatePicker_1764134690674: "",
			OTP_1764134693138: "",
			Password_1764134695746: "",
			RadioGroup_1764134697946: "1",
			Select_1764134704537: "1",
			Slider_1764134707426: 1,
			Switch_1764134711186: false,
			ToggleGroup_1764134722041: [] as string[],
			MultiSelect_1764134723000: [] as string[],
		} as z.input<typeof allFieldsFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: allFieldsFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({value}) => {
			console.log("🚀 ~ file: demo.with-all-fields.tsx:126 ~ value:", value)
			toast.success("Form submitted successfully!");
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"];
			if (!errorMap) return;
			const inputs = Array.from(
				document.querySelectorAll("#previewForm input, #previewForm textarea, #previewForm select"),
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
    listeners: {
      onChange: ({fieldApi}) => {
        console.log("🚀 ~ file: demo.with-all-fields.tsx:159 ~ fieldApi:", fieldApi.state.value)
      }
    }
	}));

	// Check if form has been modified from defaults
	const defaultValues = {
		name: "",
		email: "",
		message: "",
		agree: false,
		DatePicker_1764134690674: "",
		OTP_1764134693138: "",
		Password_1764134695746: "",
		RadioGroup_1764134697946: "1",
		Select_1764134704537: "1",
		Slider_1764134707426: 1,
		Switch_1764134711186: false,
		ToggleGroup_1764134722041: [] as string[],
		MultiSelect_1764134723000: [] as string[],
	};

	return (
		<div class="p-8 max-w-2xl mx-auto" id="previewForm">
			<allFieldsForm.AppForm>
				<allFieldsForm.Form>
					<allFieldsForm.FieldLegend class="text-2xl font-bold">
						Contact us
					</allFieldsForm.FieldLegend>
					<allFieldsForm.FieldDescription>
						Please fill the form below to contact us
					</allFieldsForm.FieldDescription>

					<div class="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<allFieldsForm.AppField name={"name"}>
							{(field) => (
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel for={"name"}>Name *</field.FieldLabel>
										<Input
											name={"name"}
											placeholder="Enter your name"
											type="text"
											value={(field().state.value as string | undefined) ?? ""}
											onBlur={field().handleBlur}
											onInput={(e) => field().handleChange(e.currentTarget.value)}
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
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel for={"email"}>Email *</field.FieldLabel>
										<Input
											name={"email"}
											placeholder="Enter your email"
											type="email"
											value={(field().state.value as string | undefined) ?? ""}
											onBlur={field().handleBlur}
											onInput={(e) => field().handleChange(e.currentTarget.value)}
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

					<allFieldsForm.AppField name={"message"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"message"}>Message *</field.FieldLabel>
									<Textarea
										placeholder="Enter your message"
										required={true}
										disabled={false}
										value={(field().state.value as string | undefined) ?? ""}
										name={"message"}
										onInput={(e) => field().handleChange(e.currentTarget.value)}
										onBlur={field().handleBlur}
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

					<allFieldsForm.AppField name={"agree"}>
						{(field) => (
							<field.FieldSet>
								<field.Field orientation="horizontal">
									<Checkbox
										checked={Boolean(field().state.value)}
										onChange={(checked) =>
											field().handleChange(checked as boolean)
										}
										disabled={false}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									>
										<CheckboxInput />
										<CheckboxControl />
									</Checkbox>
									<field.FieldContent>
										<field.FieldLabel
											class="space-y-1 leading-none"
											for={"agree"}
										>
											I agree to the terms and conditions *
										</field.FieldLabel>

										<field.FieldError />
									</field.FieldContent>
								</field.Field>
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"DatePicker_1764134690674"}>
						{(field) => {
							const dateValue = field().state.value as string;
							const date = dateValue ? new Date(dateValue) : undefined;
							return (
								<field.FieldSet class="flex flex-col w-full">
									<field.Field>
										<field.FieldLabel for={"DatePicker_1764134690674"}>
											Pick a date *
										</field.FieldLabel>
										<Popover>
											<PopoverTrigger
												as="button"
												disabled={false}
												aria-invalid={
													!!field().state.meta.errors.length &&
													field().state.meta.isTouched
												}
												class={cx(
													"w-full justify-start text-start font-normal",
													!date && "text-muted-foreground",
												)}
											>
												<Button
													variant="outline"
													class={cx(
														"w-full justify-start text-start font-normal",
														!date && "text-muted-foreground",
													)}
												>
													<CalendarIcon class="mr-2 size-4" />
													{date ? (
														formatDate(date)
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent class="w-fit p-0">
												<Calendar
													mode="single"
													selected={date}
													classNames={{
														root: 'w-fit',
													}}
													onSelect={(newDate) => {
														const dateValue = newDate instanceof Date ? newDate : undefined;
														field().handleChange(
															dateValue?.toISOString() ?? "",
														);
													}}
													aria-invalid={
														!!field().state.meta.errors.length &&
														field().state.meta.isTouched
													}
												/>
											</PopoverContent>
										</Popover>

										<field.FieldError />
									</field.Field>
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"OTP_1764134693138"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"OTP_1764134693138"}>
										One-Time Password *
									</field.FieldLabel>
									<OTPField
										maxLength={6}
										value={(field().state.value as string | undefined) ?? ""}
										onValueChange={(value) => field().handleChange(value)}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									>
										<OTPFieldGroup>
											<OTPFieldSlot index={0} />
											<OTPFieldSlot index={1} />
											<OTPFieldSlot index={2} />
										</OTPFieldGroup>
										<OTPFieldSeparator />
										<OTPFieldGroup>
											<OTPFieldSlot index={3} />
											<OTPFieldSlot index={4} />
											<OTPFieldSlot index={5} />
										</OTPFieldGroup>
										<OTPFieldInput />
									</OTPField>
								</field.Field>
								<field.FieldDescription>
									Please enter the one-time password sent to your phone.
								</field.FieldDescription>
								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"Password_1764134695746"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.FieldLabel for={"Password_1764134695746"}>
									Password Field *
								</field.FieldLabel>
								<field.Field orientation="horizontal">
									<InputGroup>
										<InputGroupInput
											id={"Password_1764134695746"}
											name={"Password_1764134695746"}
											placeholder="Enter your password"
											type={showPassword() ? "text" : "password"}
											value={(field().state.value as string | undefined) ?? ""}
											onBlur={field().handleBlur}
											onInput={(e) => field().handleChange(e.currentTarget.value)}
											aria-invalid={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
											}
										/>
										<InputGroupAddon align="inline-end">
											<button
												type="button"
												class="cursor-pointer flex items-center justify-center p-1  rounded transition-colors"
												onClick={() => setShowPassword(!showPassword())}
											>
												<Show when={!showPassword()}>
													<Eye class="size-3" />
												</Show>
												<Show when={showPassword()}>
													<EyeOff class="size-3" />
												</Show>
											</button>
										</InputGroupAddon>
									</InputGroup>
								</field.Field>

								<field.FieldError />
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"RadioGroup_1764134697946"}>
						{(field) => {
							const options = [
								{ label: "Option 1", value: "1" },
								{ label: "Option 2", value: "2" },
								{ label: "Option 3", value: "3" },
							];
							return (
								<field.FieldSet class="flex flex-col gap-2 w-full py-1">
									<field.FieldLabel class="mt-0" for={"RadioGroup_1764134697946"}>
										Pick one option *
									</field.FieldLabel>

									<field.Field>
										<RadioGroup
											onChange={field().handleChange}
											name={"RadioGroup_1764134697946"}
											value={(field().state.value as string | undefined) ?? ""}
											disabled={false}
											validationState={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
													? "invalid"
													: "valid"
											}
										>
											<For each={options}>
												{({ label, value }) => (
													<RadioGroupItem value={value} class="flex items-center gap-x-2">
														<RadioGroupItemInput />
														<RadioGroupItemControl>
															<RadioGroupItemIndicator />
														</RadioGroupItemControl>
														<RadioGroupItemLabel>{label}</RadioGroupItemLabel>
													</RadioGroupItem>
												)}
											</For>
										</RadioGroup>
									</field.Field>
									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"Select_1764134704537"}>
						{(field) => {
							const options = [
								{ label: "Option 1", value: "1" },
								{ label: "Option 2", value: "2" },
							];
							return (
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel
											class="flex justify-between items-center"
											for={"Select_1764134704537"}
										>
											Select option *
										</field.FieldLabel>
									</field.Field>
									<Select
										name={"Select_1764134704537"}
										value={options.find(
											(opt) => opt.value === field().state.value,
										)}
										onChange={(selected) =>
											field().handleChange(selected?.value ?? "")
										}
										defaultValue={options.find(
											(opt) => opt.value === field().state.value,
										)}
										disabled={false}
										validationState={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
												? "invalid"
												: "valid"
										}
										options={options}
										optionValue="value"
										optionTextValue="label"
										placeholder="Select item"
										itemComponent={(props) => (
											<SelectItem item={props.item}>
												{props.item.rawValue.label}
											</SelectItem>
										)}
									>
										<field.Field>
											<SelectTrigger class="w-full">
												<SelectValue<typeof options[number]>>
													{(state) => state.selectedOption()?.label ?? "Select item"}
												</SelectValue>
											</SelectTrigger>
										</field.Field>
										<SelectContent />
									</Select>

									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"Slider_1764134707426"}>
						{(field) => {
							const min = 0;
							const max = 100;
							const step = 5;
							const currentValue = () => field().state.value;
							return (
								<field.FieldSet class="w-full">
									<field.Field>
										<Slider
											name={"Slider_1764134707426"}
											minValue={min}
											maxValue={max}
											disabled={false}
											step={step}
                      defaultValue={[currentValue()]}
											value={[currentValue()]}
                      getValueLabel={(params) => `${params.values[0] || min} / ${max}`}
											validationState={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
													? "invalid"
													: "valid"
											}
											onChange={(newValue) => field().handleChange(newValue[0])}
                      onBlur={() => field().handleBlur()}
										>
                        <SliderGroup>
        <SliderLabel>Range</SliderLabel>
        <SliderValueLabel />
      </SliderGroup>
											<SliderTrack>
												<SliderFill />
											<SliderThumb />
											</SliderTrack>
										</Slider>
									</field.Field>
									<field.FieldDescription class="py-1">
										Adjust the range by sliding.
									</field.FieldDescription>
									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"Switch_1764134711186"}>
						{(field) => (
							<field.FieldSet class="flex flex-col p-3 justify-center w-full border rounded">
								<field.Field orientation="horizontal">
									<field.FieldContent>
										<field.FieldLabel for={"Switch_1764134711186"}>
											Toggle Switch
										</field.FieldLabel>
										<field.FieldDescription>Turn on or off.</field.FieldDescription>
									</field.FieldContent>
									<Switch
										name={"Switch_1764134711186"}
										checked={Boolean(field().state.value)}
										onChange={(checked) => {
											field().handleChange(checked);
											field().handleBlur();
										}}
										disabled={false}
										aria-invalid={
											!!field().state.meta.errors.length &&
											field().state.meta.isTouched
										}
									>
										<SwitchInput />
										<SwitchControl>
											<SwitchThumb />
										</SwitchControl>
									</Switch>
								</field.Field>
							</field.FieldSet>
						)}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"ToggleGroup_1764134722041"}>
						{(field) => {
							const options = [
								{ label: "Mon", value: "monday" },
								{ label: "Tue", value: "tuesday" },
								{ label: "Wed", value: "wednesday" },
								{ label: "Thu", value: "thursday" },
								{ label: "Fri", value: "friday" },
								{ label: "Sat", value: "saturday" },
								{ label: "Sun", value: "sunday" },
							];
							const currentValue = (field().state.value as string[]) || [];
							return (
								<field.FieldSet class="flex flex-col gap-2 w-full py-1">
									<field.Field>
										<field.FieldLabel
											class="mt-0"
											for={"ToggleGroup_1764134722041"}
										>
											Pick multiple days *
										</field.FieldLabel>

										<ToggleGroup
											multiple
											variant="outline"
											value={currentValue}
											onChange={(value) => {
												const newValue = Array.isArray(value) ? value : value ? [value] : [];
												field().handleChange(newValue as string[]);
											}}
											class="flex justify-start items-center w-full"
											aria-invalid={
												!!field().state.meta.errors.length &&
												field().state.meta.isTouched
											}
										>
											<For each={options}>
												{({ label, value }) => (
													<ToggleGroupItem
														name={"ToggleGroup_1764134722041"}
														value={value}
														disabled={false}
														class="flex items-center gap-x-2 px-1"
													>
														{label}
													</ToggleGroupItem>
												)}
											</For>
										</ToggleGroup>
									</field.Field>

									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					<allFieldsForm.AppField name={"MultiSelect_1764134723000"}>
						{(field) => {
							const options = [
								{ label: "React", value: "react" },
								{ label: "Vue", value: "vue" },
								{ label: "Angular", value: "angular" },
								{ label: "Svelte", value: "svelte" },
								{ label: "SolidJS", value: "solidjs" },
								{ label: "Next.js", value: "nextjs" },
								{ label: "Nuxt", value: "nuxt" },
								{ label: "Remix", value: "remix" },
							];
							return (
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel for={"MultiSelect_1764134723000"}>
											Select Frameworks *
										</field.FieldLabel>
										<MultiSelect
											value={(field().state.value as string[]) || []}
											onValueChange={(values) => {
												field().handleChange(values);
											}}
                      sameWidth={true}
											maxCount={5}
										>
											<MultiSelectTrigger>
												<MultiSelectValue
													placeholder="Select frameworks..."
													maxDisplay={3}
													maxItemLength={15}
												/>
											</MultiSelectTrigger>
											<MultiSelectContent>
												<MultiSelectList>
													<For each={options}>
														{({ label, value }) => (
															<MultiSelectItem
																value={value}
																label={label}
															>
																{label}
															</MultiSelectItem>
														)}
													</For>
												</MultiSelectList>
											</MultiSelectContent>
										</MultiSelect>
									</field.Field>
									<field.FieldDescription>
										Select up to 5 frameworks. Use search to filter options.
									</field.FieldDescription>
									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</allFieldsForm.AppField>

					<div class="flex justify-end items-center w-full pt-3 gap-3">
						<allFieldsForm.Subscribe
							selector={(state) => {
								const current = state.values;
								return !(
									current.name === defaultValues.name &&
									current.email === defaultValues.email &&
									current.message === defaultValues.message &&
									current.agree === defaultValues.agree &&
									current.DatePicker_1764134690674 === defaultValues.DatePicker_1764134690674 &&
									current.OTP_1764134693138 === defaultValues.OTP_1764134693138 &&
									current.Password_1764134695746 === defaultValues.Password_1764134695746 &&
									current.RadioGroup_1764134697946 === defaultValues.RadioGroup_1764134697946 &&
									current.Select_1764134704537 === defaultValues.Select_1764134704537 &&
									current.Slider_1764134707426 === defaultValues.Slider_1764134707426 &&
									current.Switch_1764134711186 === defaultValues.Switch_1764134711186 &&
									JSON.stringify(current.ToggleGroup_1764134722041) ===
										JSON.stringify(defaultValues.ToggleGroup_1764134722041) &&
									JSON.stringify(current.MultiSelect_1764134723000) ===
										JSON.stringify(defaultValues.MultiSelect_1764134723000)
								);
							}}
						>
							{(isModified) => (
								<Show when={isModified()}>
									<Button
										type="button"
										onClick={() => {
											allFieldsForm.reset();
										}}
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
