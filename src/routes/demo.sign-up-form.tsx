import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { Eye, EyeOff } from "lucide-solid";
import { toast } from "sonner";
import * as z from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

const signUpSchema = z.object({
	name: z.string().min(1, "This field is required"),
	email: z.email(),
	password: z.string().min(1, "This field is required"),
	confirmPassword: z.string().min(1, "This field is required"),
	agree: z.boolean(),
});

export const Route = createFileRoute("/demo/sign-up-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const signUpForm = useAppForm(() => ({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			agree: false,
		} as z.input<typeof signUpSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: signUpSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({}) => {
			toast.success("Sign up successful!");
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"]!;
			const inputs = Array.from(
				document.querySelectorAll("input"),
			) as HTMLInputElement[];
			let firstInput: HTMLInputElement | undefined;
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
		<div class="p-8 max-w-md mx-auto">
			<signUpForm.AppForm>
				<signUpForm.Form>
					<signUpForm.FieldLegend class="text-3xl font-bold">
						Sign Up
					</signUpForm.FieldLegend>
					<signUpForm.FieldDescription>
						You need an account to get started
					</signUpForm.FieldDescription>
					<signUpForm.FieldSeparator />
					<signUpForm.AppField name={"name"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"name"}>Name *</field.FieldLabel>
									<Input
										name={"name"}
										placeholder="Enter your Name"
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
					</signUpForm.AppField>

					<signUpForm.AppField name={"email"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"email"}>Email *</field.FieldLabel>
									<Input
										name={"email"}
										placeholder="Enter your Email"
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
					</signUpForm.AppField>

					<signUpForm.AppField name={"password"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.FieldLabel for={"password"}>Password *</field.FieldLabel>
								<field.Field orientation="horizontal">
									<field.InputGroup>
										<field.InputGroupInput
											id={"password"}
											name={"password"}
											placeholder="Password"
											type="password"
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
										<field.InputGroupAddon align="inline-end">
											<button
												type="button"
												class="cursor-pointer flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors"
												onClick={(e) => {
													const input =
														e.currentTarget.parentElement?.parentElement?.querySelector(
															"input",
														) as HTMLInputElement;
													if (input) {
														input.type =
															input.type === "password" ? "text" : "password";
														const button = e.currentTarget;
														button.setAttribute(
															"data-show",
															input.type === "text" ? "true" : "false",
														);
													}
												}}
												data-show="false"
											>
												<Eye class="size-3 data-[show=true]:hidden" />
												<EyeOff class="size-3 hidden data-[show=true]:block" />
											</button>
										</field.InputGroupAddon>
									</field.InputGroup>
								</field.Field>

								<field.FieldError />
							</field.FieldSet>
						)}
					</signUpForm.AppField>

					<signUpForm.AppField name={"confirmPassword"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.FieldLabel for={"confirmPassword"}>
									Confirm Password *
								</field.FieldLabel>
								<field.Field orientation="horizontal">
									<field.InputGroup>
										<field.InputGroupInput
											id={"confirmPassword"}
											name={"confirmPassword"}
											placeholder="Confirm Password"
											type="password"
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
										<field.InputGroupAddon align="inline-end">
											<button
												type="button"
												class="cursor-pointer flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors"
												onClick={(e) => {
													const input =
														e.currentTarget.parentElement?.parentElement?.querySelector(
															"input",
														) as HTMLInputElement;
													if (input) {
														input.type =
															input.type === "password" ? "text" : "password";
														const button = e.currentTarget;
														button.setAttribute(
															"data-show",
															input.type === "text" ? "true" : "false",
														);
													}
												}}
												data-show="false"
											>
												<Eye class="size-3 data-[show=true]:hidden" />
												<EyeOff class="size-3 hidden data-[show=true]:block" />
											</button>
										</field.InputGroupAddon>
									</field.InputGroup>
								</field.Field>

								<field.FieldError />
							</field.FieldSet>
						)}
					</signUpForm.AppField>

					<signUpForm.AppField name={"agree"}>
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
									/>
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
					</signUpForm.AppField>

					<div class="flex justify-end items-center w-full pt-3">
						<signUpForm.SubmitButton label="Submit" />
					</div>
				</signUpForm.Form>
			</signUpForm.AppForm>
		</div>
	);
}
