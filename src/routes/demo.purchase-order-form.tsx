import { revalidateLogic } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { Plus, Trash2 } from "lucide-solid";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	FieldDescription,
	FieldLegend,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/seperator";
import {
	Slider,
	SliderFill,
	SliderThumb,
	SliderTrack,
} from "@/components/ui/slider";
import { useAppForm } from "@/components/ui/tanstack-form";

const purchaseOrderForm = z.object({
	orderNumber: z.string().min(1, "This field is required"),
	customerName: z.string().min(1, "This field is required"),
	items: z.array(
		z.object({
			itemName: z.string().min(1, "This field is required"),
			quantity: z
				.number()
				.min(1, "Must be at least 1")
				.max(50, "Must be at most 50"),
		}),
	),
});

export const Route = createFileRoute("/demo/purchase-order-form")({
	component: RouteComponent,
});

function RouteComponent() {
	const orderForm = useAppForm(() => ({
		defaultValues: {
			orderNumber: "",
			customerName: "",
			items: [
				{
					itemName: "",
					quantity: 1,
				},
			],
		} as z.input<typeof purchaseOrderForm>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: purchaseOrderForm,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({}) => {
			toast.success("Purchase order submitted successfully!");
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
		<div class="p-8 max-w-2xl mx-auto">
			<orderForm.AppForm>
				<orderForm.Form>
					<orderForm.FieldLegend class="text-3xl font-bold">
						Purchase Order
					</orderForm.FieldLegend>
					<orderForm.FieldDescription>
						Create a purchase order with multiple items
					</orderForm.FieldDescription>
					<orderForm.FieldSeparator />
					<orderForm.AppField name={"orderNumber"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"orderNumber"}>
										Order Number *
									</field.FieldLabel>
									<Input
										name={"orderNumber"}
										placeholder="Enter order number"
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
					</orderForm.AppField>
					<orderForm.AppField name={"customerName"}>
						{(field) => (
							<field.FieldSet class="w-full">
								<field.Field>
									<field.FieldLabel for={"customerName"}>
										Customer Name *
									</field.FieldLabel>
									<Input
										name={"customerName"}
										placeholder="Enter customer name"
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
					</orderForm.AppField>
					<orderForm.AppField name="items" mode="array">
						{(field) => (
							<div class="w-full space-y-4">
								<Index each={field().state.value as any[]}>
									{(_, index) => (
										<div class="space-y-3 p-4 relative">
											<Separator />
											<orderForm.AppField name={`items[${index}].itemName`}>
												{(itemField) => (
													<itemField.FieldSet class="w-full">
														<itemField.Field>
															<itemField.FieldLabel
																for={`items[${index}].itemName`}
															>
																Item Name *
															</itemField.FieldLabel>
															<Input
																name={`items[${index}].itemName`}
																placeholder="Enter item name"
																type="text"
																value={
																	(itemField().state.value as
																		| string
																		| undefined) ?? ""
																}
																onBlur={itemField().handleBlur}
																onInput={(e) =>
																	itemField().handleChange(
																		e.currentTarget.value,
																	)
																}
																aria-invalid={
																	!!itemField().state.meta.errors.length &&
																	itemField().state.meta.isTouched
																}
															/>
														</itemField.Field>

														<itemField.FieldError />
													</itemField.FieldSet>
												)}
											</orderForm.AppField>

											<orderForm.AppField name={`items[${index}].quantity`}>
												{(quantityField) => {
													const min = 1;
													const max = 50;
													const step = 3;
													const currentValue = quantityField().state.value;
													const sliderValue = Array.isArray(currentValue)
														? currentValue
														: [currentValue || min];

													return (
														<quantityField.FieldSet class="w-full">
															<quantityField.Field>
																<quantityField.FieldLabel
																	class="flex justify-between items-center"
																	for={`items[${index}].quantity`}
																>
																	Quantity *
																	<span class="text-sm text-muted-foreground">
																		{sliderValue[0] || min} / {max}
																	</span>
																</quantityField.FieldLabel>
																<Slider
																	name={`items[${index}].quantity`}
																	minValue={min}
																	maxValue={max}
																	step={step}
																	value={sliderValue}
																	validationState={
																		!!quantityField().state.meta.errors
																			.length &&
																		quantityField().state.meta.isTouched
																			? "invalid"
																			: "valid"
																	}
																	onChange={(newValue) => {
																		quantityField().handleChange(newValue[0]);
																		quantityField().handleBlur();
																	}}
																>
																	<SliderTrack>
																		<SliderFill />
																		<SliderThumb />
																	</SliderTrack>
																</Slider>
															</quantityField.Field>
															<quantityField.FieldDescription class="py-1">
																Adjust the quantity using the slider.
															</quantityField.FieldDescription>
															<quantityField.FieldError />
														</quantityField.FieldSet>
													);
												}}
											</orderForm.AppField>
										</div>
									)}
								</Index>
								<div class="flex justify-between pt-2">
									<Button
										variant="outline"
										type="button"
										onClick={() =>
											field().pushValue(
												{
													itemName: "",
													quantity: 1,
												},
												{ dontValidate: true },
											)
										}
									>
										<Plus class="h-4 w-4 mr-2" /> Add Item
									</Button>
									<Button
										variant="outline"
										type="button"
										onClick={() =>
											field().removeValue(
												(field().state.value as any[]).length - 1,
											)
										}
										disabled={(field().state.value as any[]).length <= 1}
									>
										<Trash2 class="h-4 w-4 mr-2" /> Remove Item
									</Button>
								</div>
							</div>
						)}
					</orderForm.AppField>
					<div class="flex justify-end items-center w-full pt-3">
						<orderForm.SubmitButton label="Submit" />
					</div>
				</orderForm.Form>
			</orderForm.AppForm>
		</div>
	);
}
