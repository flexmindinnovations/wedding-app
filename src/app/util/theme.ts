import { FormArray, FormGroup } from "@angular/forms";
export const DOMAIN = 'Susangam';
export const COLOR_SCHEME = 'br';

const redButton = `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:dark:bg-gray-800 disabled:dark:opacity-70 disabled:dark:shadow-none disabled:bg-gray-300 disabled:opacity-70 disabled:shadow-none disabled:hover:bg-gray-300 dark:focus:ring-gray-400`;

const boButton = `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-bo-500 hover:bg-bo-600 focus:ring-4 focus:outline-none focus:ring-bo-300 font-medium rounded-lg text-sm text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:dark:bg-gray-800 disabled:dark:opacity-70 disabled:dark:shadow-none disabled:bg-gray-300 disabled:opacity-70 disabled:shadow-none disabled:hover:bg-gray-300 dark:focus:ring-gray-400`;

const brButton = `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-br-500 hover:bg-br-600 focus:ring-4 focus:outline-none focus:ring-br-300 font-medium rounded-lg text-sm text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:dark:bg-gray-800 disabled:dark:opacity-70 disabled:dark:shadow-none disabled:bg-gray-300 disabled:opacity-70 disabled:shadow-none disabled:hover:bg-gray-300 dark:focus:ring-gray-400`;

export const dashboardCards: any = {
    red: `
    bg-red-500 hover:bg-red-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    
    `,
    bo: `
    bg-bo-500 hover:bg-bo-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    
    `,
    br: `
    bg-br-500 hover:bg-br-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    
    `
}


export const themeVariables: any = {
    red: `
    bg-red-500 hover:bg-red-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    `,
    bo: `
    bg-bo-500 hover:bg-bo-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    `,
    br: `
    bg-br-500 hover:bg-br-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    `
}

export const buttonThemeVariables: any = {
    red: {
        sm: redButton + ' px-2 py-1',
        md: redButton + ' px-3 py-2',
        lg: redButton + ' px-5 py-2.5'
    },
    bo: {
        sm: boButton + ' px-2 py-1',
        md: boButton + ' px-3 py-2',
        lg: boButton + ' px-5 py-2.5'
    },
    br: {
        sm: brButton + ' px-2 py-1',
        md: brButton + ' px-3 py-2',
        lg: brButton + ' px-5 py-2.5'
    }
}

export const iconSize = {
    small: 'text-sm',
    normal: 'text-xl',
    large: 'text-2xl'
}

export const inputThemeVariables: any = {
    red: `bg-gray-50 border border-gray-300 text-gray-900 border-solid text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500`,
    bo: `bg-gray-50 border border-gray-300 text-gray-900 border-solid text-sm rounded-lg focus:ring-bo-600 focus:border-bo-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-bo-500 dark:focus:border-bo-500`,
    br: `bg-gray-50 border border-gray-300 text-gray-900 border-solid text-sm rounded-lg focus:ring-br-600 focus:border-br-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-br-500 dark:focus:border-br-500`
}

export const dropdownThemeVariables: any = {
    red: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white h-12
    `,
    bo: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-bo-300 focus:border-red-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white h-12
    `,
    br: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-br-300 focus:border-red-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white h-12
    `
}

export const stepperThemeVariables: any = {
    lastItem: {
        line: {
            active: `text-${COLOR_SCHEME}-600 dark:text-${COLOR_SCHEME}-500`,
            inactive: ``,
            complete: `text-green-300`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-${COLOR_SCHEME}-100 rounded-full lg:h-12 lg:w-12 dark:bg-${COLOR_SCHEME}-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `bg-green-200`,
        }
    },
    red: {
        line: {
            active: `flex w-full items-center text-red-600 dark:text-red-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-red-100 after:border-4 after:inline-block dark:after:border-red-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-800`,
            complete: `flex w-full items-center text-green-700 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-100 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-red-300 rounded-full lg:h-12 lg:w-12 dark:bg-red-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-300 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    },
    bo: {
        line: {
            active: `flex w-full items-center text-bo-600 dark:text-bo-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-bo-300 after:border-4 after:inline-block dark:after:border-bo-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4 after:inline-block dark:after:border-gray-800`,
            complete: `flex w-full items-center text-green-700 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-300 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-bo-300 rounded-full lg:h-12 lg:w-12 dark:bg-bo-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-300 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    },
    br: {
        line: {
            active: `flex w-full items-center text-br-600 dark:text-br-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-br-300 after:border-4 after:inline-block dark:after:border-br-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4 after:inline-block dark:after:border-gray-800`,
            complete: `flex w-full items-center text-green-700 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-300 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-br-300 rounded-full lg:h-12 lg:w-12 dark:bg-br-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-300 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    }
}


export const convertObjectToJson = (obj: any) => {

}

export const AUTO_DISMISS_TIMER: number = 4500;

export const getRandomNumber = (src: string): string => {
    const max = 100;
    const min = 1;
    return `${src}-${Math.floor(Math.random() * (max - min + 1)) + min}`;
}

export const findInvalidControlsRecursive = (formToInvestigate: FormGroup | FormArray): string[] => {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
        Object.keys(form.controls).forEach(field => {
            const control: any = form.get(field);
            if (control.invalid) invalidControls.push(field);
            if (control instanceof FormGroup) {
                recursiveFunc(control);
            } else if (control instanceof FormArray) {
                recursiveFunc(control);
            }
        });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
}

export const nestedRoutes = ['users', 'customers', 'branch', 'events', 'blog', '/users/add', 'customers/add', '/branch/add', '/events/add', '/events/edit', '/branch/edit', '/users/edit', '/blog/add', '/blog/edit'];

export const TITHI_LIST = [
    { title: 'Gotra', value: '' },
    { title: 'Raas', value: '' },
    { title: 'Nakshatra', value: '' },
    { title: 'Charan', value: '' },
    { title: 'Nadi', value: '' },
    { title: 'Gana', value: '' }
];