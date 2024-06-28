import { createAction, props } from '@ngrx/store';

export const saveData = createAction(
    '[ProfileStatusData] Save', 
    props<{profileStatusData: any}>()    
);
export const getData = createAction(
    '[ProfileStatusData] GET'
);
export const resetData = createAction('reset');