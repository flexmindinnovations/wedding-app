import { createReducer, on } from '@ngrx/store';
// import { saveData, resetData } from './store.actions';
import * as pageActions from './store.actions'

export const initialState: any = {};

export const dataReducer = createReducer(
    initialState,
    on(pageActions.saveData, (state, {profileStatusData}) => ({...state ,...profileStatusData})),
    on(pageActions.getData, (state) => state),
    on(pageActions.resetData, (state) => undefined)
)