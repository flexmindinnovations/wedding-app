export interface FormStep {
    source: string;
    data: {} | any;
    formId: number;
    action: ActionValue;
    isCompleted: boolean;
    previous?: FormStep | null;
    next?: FormStep | null;
}


export enum ActionValue {
    previous,
    next
}