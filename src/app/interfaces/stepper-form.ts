import { FormStep } from "./form-step-item";

export interface StepperFormItem {
    id: number;
    title: string;
    route: string;
    isActive: boolean;
    isCompleted: boolean;
    icon: string;
}