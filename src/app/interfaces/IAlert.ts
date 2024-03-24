import { AlertType } from "../enums/alert-types";

export interface IAlert {
    type: AlertType
    message: string;
    alertId: string;
}