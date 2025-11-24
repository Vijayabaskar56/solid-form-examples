import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { toast } from "sonner";
import * as z from "zod";

import { Textarea } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

const feedbackFormSchema = z.object({
	comment: z.string().min(1, "This field is required"),
});

export const Route = createFileRoute("/demo/feedback-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const feedbackForm = useAppForm(() => ({
		defaultValues: {
			comment: "",
		} as z.input<typeof feedbackFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: feedbackFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: () => {
			toast.success("Feedback submitted successfully!");
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"]!;
			const inputs = Array.from(
				document.querySelectorAll("textarea, input"),
			) as (HTMLTextAreaElement | HTMLInputElement)[];
			let firstInput: HTMLTextAreaElement | HTMLInputElement | undefined;
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
			<feedbackForm.AppForm>
				<feedbackForm.Form>
					<feedbackForm.FieldLegend class="text-3xl font-bold">
						Feedback Form
					</feedbackForm.FieldLegend>
					<feedbackForm.FieldDescription>
						Please provide your feedback
					</feedbackForm.FieldDescription>
					<feedbackForm.FieldSeparator />
					<feedbackForm.AppField name={"comment"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"comment"}>
										Feedback Comment *
									</field.FieldLabel>
									<Textarea
										name={"comment"}
										placeholder="Share your feedback"
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
					</feedbackForm.AppField>
					<div class="flex justify-end items-center w-full pt-3">
						<feedbackForm.SubmitButton label="Submit" />
					</div>
				</feedbackForm.Form>
			</feedbackForm.AppForm>
		</div>
	);
}
