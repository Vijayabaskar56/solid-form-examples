import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { toast } from "sonner";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

const waitlistFormSchema = z.object({
	email: z.string().email(),
});

export const Route = createFileRoute("/demo/waitlist-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const waitlistForm = useAppForm(()=> ({
		defaultValues: {
			email: "",
		} as z.input<typeof waitlistFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: waitlistFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({}) => {
			toast.success("Successfully joined waitlist!");
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
			<waitlistForm.AppForm>
				<waitlistForm.Form>
					<waitlistForm.FieldLegend class="text-3xl font-bold">
						Waitlist
					</waitlistForm.FieldLegend>
					<waitlistForm.FieldDescription>
						Join our waitlist to get early access
					</waitlistForm.FieldDescription>
					<waitlistForm.FieldSeparator />
					<waitlistForm.AppField name={"email"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"email"}>
										Your Email *
									</field.FieldLabel>
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
					</waitlistForm.AppField>
					<div class="flex justify-end items-center w-full pt-3">
						<waitlistForm.SubmitButton label="Submit" />
					</div>
				</waitlistForm.Form>
			</waitlistForm.AppForm>
		</div>
	);
}
