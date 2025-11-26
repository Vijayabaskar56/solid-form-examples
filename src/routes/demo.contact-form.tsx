import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { toast } from "sonner";
import * as z from "zod";

import {
	Checkbox,
	CheckboxControl,
	CheckboxInput,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input, Textarea } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

const contactUsFormSchema = z.object({
	name: z.string().min(1, "This field is required"),
	email: z.string().email(),
	message: z.string().min(1, "This field is required"),
	agree: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms and conditions",
	}),
});

export const Route = createFileRoute("/demo/contact-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const contactUsForm = useAppForm(() => ({
		defaultValues: {
			name: "",
			email: "",
			message: "",
			agree: false,
		} as z.input<typeof contactUsFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: contactUsFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({}) => {
			toast.success("success");
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"]!;
			const inputs = Array.from(
				document.querySelectorAll("input, textarea"),
			) as (HTMLInputElement | HTMLTextAreaElement)[];
			let firstInput: HTMLInputElement | HTMLTextAreaElement | undefined;
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
			<contactUsForm.AppForm>
				<contactUsForm.Form>
					<contactUsForm.FieldLegend class="text-3xl font-bold">
						Contact us
					</contactUsForm.FieldLegend>
					<contactUsForm.FieldDescription>
						Please fill the form below to contact us
					</contactUsForm.FieldDescription>
					<contactUsForm.FieldSeparator />
					<div class="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<contactUsForm.AppField name={"name"}>
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
						</contactUsForm.AppField>
						<contactUsForm.AppField name={"email"}>
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
						</contactUsForm.AppField>
					</div>
					<contactUsForm.AppField name={"message"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"message"}>Message *</field.FieldLabel>
									<Textarea
										placeholder="Enter your message"
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
					</contactUsForm.AppField>
					<contactUsForm.AppField name={"agree"}>
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
					</contactUsForm.AppField>
					<div class="flex justify-end items-center w-full pt-3">
						<contactUsForm.SubmitButton label="Submit" />
					</div>
				</contactUsForm.Form>
			</contactUsForm.AppForm>
		</div>
	);
}
