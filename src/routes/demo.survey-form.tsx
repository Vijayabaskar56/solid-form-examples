import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { toast } from "sonner";
import * as z from "zod";

import { Input, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppForm, withFieldGroup } from "@/components/ui/tanstack-form";
import { useFormStepper } from "@/hooks/use-stepper";

const surveyFormSchema = z.object({
	name: z.string().min(1, "This field is required"),
	lastName: z.string().min(1, "This field is required"),
	yourEmail: z.string().email("Invalid email address"),
	phoneNumber: z.number(),
	preferences: z.array(z.string()).min(1, "This field is required"),
	comment: z.string().min(1, "This field is required"),
});

export const stepSchemas = [
	// Step 1
	surveyFormSchema.pick({
		name: true,
		lastName: true,
	}),
	// Step 2
	surveyFormSchema.pick({
		yourEmail: true,
		phoneNumber: true,
	}),
	// Step 3
	surveyFormSchema.pick({
		preferences: true,
		comment: true,
	}),
];

const Step1Group = withFieldGroup({
	defaultValues: {
		name: "",
		lastName: "",
	},
	render: function Step1Render({ group }) {
		return (
			<div>
				<group.FieldLegend class="text-3xl font-bold">
					Personal Details
				</group.FieldLegend>
				<group.FieldDescription>
					Please provide your personal details
				</group.FieldDescription>
				<group.FieldSeparator />
				<group.AppField name={"name"}>
					{(field) => (
						<field.FieldSet class="w-full">
							<field.Field>
								<field.FieldLabel for={"name"}>First name *</field.FieldLabel>
								<Input
									name={"name"}
									placeholder="First name"
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
				</group.AppField>

				<group.AppField name={"lastName"}>
					{(field) => (
						<field.FieldSet class="w-full">
							<field.Field>
								<field.FieldLabel for={"lastName"}>Last name </field.FieldLabel>
								<Input
									name={"lastName"}
									placeholder="Last name"
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
				</group.AppField>
			</div>
		);
	},
});

const Step2Group = withFieldGroup({
	defaultValues: {
		yourEmail: "",
		phoneNumber: 0,
	},
	render: function Step2Render({ group }) {
		return (
			<div>
				<group.FieldLegend class="text-3xl font-bold">
					Contact Information
				</group.FieldLegend>
				<group.FieldDescription>
					Please provide your contact information
				</group.FieldDescription>
				<group.FieldSeparator />
				<group.AppField name={"yourEmail"}>
					{(field) => (
						<field.FieldSet class="w-full">
							<field.Field>
								<field.FieldLabel for={"yourEmail"}>
									Your Email *
								</field.FieldLabel>
								<Input
									name={"yourEmail"}
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
				</group.AppField>

				<group.AppField name={"phoneNumber"}>
					{(field) => (
						<field.FieldSet class="w-full">
							<field.Field>
								<field.FieldLabel for={"phoneNumber"}>
									Phone Number{" "}
								</field.FieldLabel>
								<Input
									name={"phoneNumber"}
									placeholder="Enter your phone number"
									type="number"
									inputMode="decimal"
									value={field().state.value}
									onBlur={field().handleBlur}
									onInput={(e) =>
										field().handleChange(e.currentTarget.valueAsNumber)
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
				</group.AppField>
			</div>
		);
	},
});

const Step3Group = withFieldGroup({
	defaultValues: {
		preferences: [] as string[],
		comment: "",
	},
	render: function Step3Render({ group }) {
		return (
			<div>
				<group.FieldLegend class="text-3xl font-bold">
					Your Preferences
				</group.FieldLegend>
				<group.FieldDescription>
					Tell us about your interests and preferences.
				</group.FieldDescription>
				<group.FieldSeparator />
				<group.AppField name={"preferences"}>
					{(field) => {
						const options = [
							{ label: "Technology", value: "technology" },
							{ label: "Business", value: "Business" },
							{ label: "Health", value: "Health" },
							{ label: "Science", value: "Science" },
						];
						return (
							<field.FieldSet class="flex flex-col gap-2 w-full py-1">
								<field.Field>
									<field.FieldLabel class="mt-0" for={"preferences"}>
										Preferences *
									</field.FieldLabel>

									<ToggleGroup
										multiple
										variant="outline"
										value={field().state.value as string[]}
										onChange={(value) => {
											const newValue = Array.isArray(value)
												? value
												: value
													? [value]
													: [];
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
													name={"preferences"}
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
				</group.AppField>

				<group.AppField name={"comment"}>
					{(field) => (
						<field.FieldSet class="w-full">
							<field.Field>
								<field.FieldLabel for={"comment"}>
									Feedback Comment{" "}
								</field.FieldLabel>
								<Textarea
									placeholder="Share your feedback"
									required={false}
									disabled={false}
									value={(field().state.value as string | undefined) ?? ""}
									name={"comment"}
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
				</group.AppField>
			</div>
		);
	},
});

export const Route = createFileRoute("/demo/survey-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		currentValidator,
		step,
		currentStep,
		isFirstStep,
		handleCancelOrBack,
		handleNextStepOrSubmit,
	} = useFormStepper(stepSchemas);

	const surveyForm = useAppForm(() => ({
		defaultValues: {
			name: "",
			lastName: "",
			yourEmail: "",
			phoneNumber: 0,
			preferences: [] as string[],
			comment: "",
		} as z.input<typeof surveyFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: currentValidator() as typeof surveyFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: () => {
			toast.success("Submitted Successfully");
		},
	}));

	const groups: Record<number, any> = {
		1: (
			<Step1Group
				form={surveyForm}
				fields={{ name: "name", lastName: "lastName" }}
			/>
		),
		2: (
			<Step2Group
				form={surveyForm}
				fields={{ yourEmail: "yourEmail", phoneNumber: "phoneNumber" }}
			/>
		),
		3: (
			<Step3Group
				form={surveyForm}
				fields={{ preferences: "preferences", comment: "comment" }}
			/>
		),
	};

	const handleNext = async () => {
		await handleNextStepOrSubmit(surveyForm);
	};

	const handlePrevious = () => {
		handleCancelOrBack({
			onBack: () => {},
		});
	};

	const current = () => groups[currentStep()];

	return (
		<div class="p-8 max-w-2xl mx-auto">
			<surveyForm.AppForm>
				<surveyForm.Form>
					<surveyForm.FieldLegend class="text-2xl font-bold">
						Survey Form
					</surveyForm.FieldLegend>
					<surveyForm.FieldDescription>
						Multi-Step Form Examples
					</surveyForm.FieldDescription>
					<surveyForm.FieldSeparator />
					<div class="flex flex-col gap-2 pt-3">
						<div class="flex flex-col items-center justify-start gap-1">
							<span>
								Step {currentStep()} of {Object.keys(groups).length}
							</span>
							<Progress
								value={(currentStep() / Object.keys(groups).length) * 100}
							/>
						</div>
						<div class="flex flex-col gap-2">{current()}</div>
						<div class="flex items-center justify-between gap-3 w-full pt-3">
							<surveyForm.StepButton
								label="Previous"
								disabled={isFirstStep()}
								handleMovement={() =>
									handleCancelOrBack({
										onBack: () => handlePrevious(),
									})
								}
							/>
							<Show when={step().isCompleted}>
								<surveyForm.SubmitButton
									label="Submit"
									onClick={() => handleNextStepOrSubmit(surveyForm)}
								/>
							</Show>
							<Show when={!step().isCompleted}>
								<surveyForm.StepButton
									label="Next"
									handleMovement={handleNext}
								/>
							</Show>
						</div>
					</div>
				</surveyForm.Form>
			</surveyForm.AppForm>
		</div>
	);
}
