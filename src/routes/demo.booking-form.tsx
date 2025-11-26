import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { For } from "solid-js";
import { toast } from "sonner";
import * as z from "zod";

import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useAppForm } from "@/components/ui/tanstack-form";

const bookingFormSchema = z.object({
	firstName: z.string().min(1, "This field is required"),
	lastName: z.string().min(1, "This field is required"),
	email: z.string().email(),
	orderNumber: z.string().min(1, "This field is required").optional(),
	category: z.string().min(1, "This field is required"),
	priority: z.string().min(1, "This field is required"),
	description: z.string().min(1, "This field is required"),
});

export const Route = createFileRoute("/demo/booking-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const bookingForm = useAppForm(() => ({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			orderNumber: "",
			category: "technical",
			priority: "low",
			description: "",
		} as z.input<typeof bookingFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: bookingFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({}) => {
			toast.success("success");
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

	return (
		<div class="p-8 max-w-2xl mx-auto">
			<bookingForm.AppForm>
				<bookingForm.Form>
					<bookingForm.FieldLegend class="text-3xl font-bold">
						Customer Support Request
					</bookingForm.FieldLegend>
					<bookingForm.FieldDescription>
						We're here to help! Please describe your issue below.
					</bookingForm.FieldDescription>
					<bookingForm.FieldSeparator />
					<div class="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<bookingForm.AppField name={"firstName"}>
							{(field) => (
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel for={"firstName"}>
											First Name *
										</field.FieldLabel>
										<Input
											name={"firstName"}
											placeholder="Enter your first name"
											type="text"
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
						</bookingForm.AppField>
						<bookingForm.AppField name={"lastName"}>
							{(field) => (
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel for={"lastName"}>
											Last Name *
										</field.FieldLabel>
										<Input
											name={"lastName"}
											placeholder="Enter your last name"
											type="text"
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
						</bookingForm.AppField>
					</div>
					<bookingForm.AppField name={"email"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"email"}>
										Email Address *
									</field.FieldLabel>
									<Input
										name={"email"}
										placeholder="Enter your email address"
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
					</bookingForm.AppField>
					<bookingForm.AppField name={"orderNumber"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"orderNumber"}>
										Order Number (if applicable)
									</field.FieldLabel>
									<Input
										name={"orderNumber"}
										placeholder="Enter your order number"
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
					</bookingForm.AppField>
					<bookingForm.AppField name={"category"}>
						{(field) => {
							const options = [
								{ label: "Technical Issue", value: "technical" },
								{ label: "Billing Question", value: "billing" },
								{ label: "Product Inquiry", value: "product" },
								{ label: "Account Access", value: "account" },
								{ label: "Other", value: "other" },
							];
							return (
								<field.FieldSet class="w-full">
									<field.Field>
										<field.FieldLabel
											class="flex justify-between items-center"
											for={"category"}
										>
											Issue Category *
										</field.FieldLabel>
									</field.Field>
									<Select
										name={"category"}
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
										placeholder="Select Category"
										itemComponent={(props) => (
											<SelectItem item={props.item}>
												{props.item.rawValue.label}
											</SelectItem>
										)}
									>
										<field.Field>
											<SelectTrigger class="w-full">
												<SelectValue<(typeof options)[number]>>
													{(state) =>
														state.selectedOption()?.label ?? "Select Category"
													}
												</SelectValue>
											</SelectTrigger>
										</field.Field>
										<SelectContent />
									</Select>

									<field.FieldError />
								</field.FieldSet>
							);
						}}
					</bookingForm.AppField>
					<bookingForm.AppField name={"priority"}>
						{(field) => {
							const options = [
								{ label: "Low - General inquiry", value: "low" },
								{ label: "Medium - Issue affecting usage", value: "medium" },
								{ label: "High - Urgent issue", value: "high" },
							];
							return (
								<field.FieldSet class="flex flex-col gap-2 w-full py-1">
									<field.FieldLabel class="mt-0" for={"priority"}>
										Priority Level *
									</field.FieldLabel>

									<field.Field>
										<RadioGroup
											onChange={field().handleChange}
											name={"priority"}
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
													<RadioGroupItem
														value={value}
														class="flex items-center gap-x-2"
													>
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
					</bookingForm.AppField>
					<bookingForm.AppField name={"description"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"description"}>
										Issue Description *
									</field.FieldLabel>
									<Textarea
										placeholder="Please describe your issue in detail..."
										value={(field().state.value as string | undefined) ?? ""}
										name={"description"}
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
					</bookingForm.AppField>
					<div class="flex justify-end items-center w-full pt-3">
						<bookingForm.SubmitButton label="Submit" />
					</div>
				</bookingForm.Form>
			</bookingForm.AppForm>
		</div>
	);
}
