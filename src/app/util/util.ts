import { faHome, faBlog, faCalendarDays, faEllipsis, faExclamationCircle, faAddressBook, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ClickEvent, MoveDirection, OutMode } from "@tsparticles/engine";
import * as CryptoJs from 'crypto-js';
import { sha512 } from 'js-sha512';
import { DOMAIN } from './theme';
import { environment } from 'src/environments/environment';

const homeIcon = faHome;
const blogIcon = faBlog;
const calenderIcon = faCalendarDays;
const contactIcon = faAddressBook;
const aboutIcon = faCircleInfo;

export const SLIDE_INTERVAL = 4000;

export let HASH_STRING = '';
export const SECRET_KEY = 'JPM7Fg';
export const MERCHANT_KEY_TEST = 'B15aom';
export const MERCHANT_KEY_LIVE = 'WA6Kpg';
export let SALT_KEY_TEST = 'XDbX0tFwbufYsXjSrVWjxTgaB64RVnB3';
export let SALT_KEY_LIVE = 'X4Y3GsJwPYB8OM34PrgIah1n0K8zYI2P';

const availableLoaders: any = {
    dots: 'dots',
    lines: 'lines',
    smallLines: 'lines-small',
    sharpLines: 'lines-sharp',
    smallSharpLines: 'lines-sharp-small',
    bubbles: 'bubbles',
    circles: 'circles',
    circular: 'circular',
    crescent: 'crescent'
}

export const APP_LOADER = availableLoaders.dots;

export const tabItems = {
    displayed: [
        {
            "id": 1,
            "title": "Home",
            "route": "",
            "isActive": false,
            "icon": homeIcon
        },
        {
            "id": 2,
            "title": "Blogs",
            "route": "blog",
            "isActive": false,
            "icon": blogIcon
        },
        // {
        //     "id": 3,
        //     "title": "Events",
        //     "route": "events",
        //     "isActive": false,
        //     "icon": calenderIcon
        // },
        {
            "id": 3,
            "title": "About",
            "route": "about",
            "isActive": false,
            "icon": aboutIcon
        },
        {
            "id": 4,
            "title": "More",
            "route": "more",
            "isActive": false,
            "icon": faEllipsis
        }
    ],
    nested: [
        {
            "id": 5,
            "title": "Profile",
            "route": "profile",
            "isActive": false,
            "icon": "fa-solid fa-address-card"
        },
        // {
        //     "id": 3,
        //     "title": "Login",
        //     "route": "login",
        //     "isActive": false
        // },
        // {
        //     "id": 4,
        //     "title": "Register",
        //     "route": "register",
        //     "isActive": false
        // },
        {
            id: 6,
            "title": "Public Profile",
            "route": "profiles/view/userId",
            "isActive": false
        },
        {
            "id": 1,
            "title": "About",
            "route": "about",
            "isActive": false
        },
    ]
}

export const MENU_ITEMS = [
    {
        "id": 1,
        "title": "Home",
        "route": "",
        "isActive": false,
        "icon": homeIcon
    },
    {
        "id": 6,
        "title": "Blogs",
        "route": "blog",
        "isActive": false,
        "icon": blogIcon
    },
    // {
    //     "id": 7,
    //     "title": "Events",
    //     "route": "events",
    //     "isActive": false,
    //     "icon": calenderIcon
    // },
    {
        "id": 8,
        "title": "About",
        "route": "about",
        "isActive": false,
        "icon": faExclamationCircle
    },
    {
        "id": 9,
        "title": "Contact",
        "route": "contact",
        "isActive": false,
        "icon": contactIcon
    },
]

export const particlesOptions = {
    background: {
        color: {
            value: "#0d47a1",
        },
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                // mode:,
            },
            onHover: {
                enable: true,
            },
            resize: true,
        },
        modes: {
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
        },
    },
    particles: {
        preset: 'fire',
        actualOptions: {
            fullScreen: {
                enable: false,
                zIndex: 0
            },
        },
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        move: {
            direction: MoveDirection.none,
            enable: true,
            outModes: {
                default: OutMode.bounce,
            },
            random: false,
            speed: 6,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 80,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
    detectRetina: true,
};


export const paymentHtmlPayload = (payment: Payment) => {
    const paymentResponse = `${window.location.href}response`;
    const { txnId, amount, productinfo, email, firstname, lastname, phone } = payment;
    HASH_STRING = genertateHash({ txnId, amount, productinfo, firstname, email, phone });
    const htmlBody = `
    <html>
    <body>
    <form action='${environment.paymentTestingUrl}' method='post'>
    <input type="hidden" name="key" value="${MERCHANT_KEY_TEST}" />
    <input type="hidden" name="txnid" value="${txnId}" />
    <input type="hidden" name="productinfo" value="${productinfo}" />
    <input type="hidden" name="amount" value="${amount}" />
    <input type="hidden" name="email" value="${email}" />
    <input type="hidden" name="firstname" value="${firstname}" />
    <input type="hidden" name="lastname" value="${lastname}" />
    <input type="hidden" name="surl" value="${paymentResponse}" />
    <input type="hidden" name="furl" value="${paymentResponse}" />
    <input type="hidden" name="phone" value="${phone}” />
    <input type="hidden" name="hash" value="${HASH_STRING}" />
    <input type="submit" value="submit"> </form>
    </body>
    </html>
    `;

    return htmlBody;
}

const genertateHash = ({ txnId, amount, productinfo, firstname, email, phone }: { txnId: string, amount: string, productinfo: string, firstname: string, email: string, phone: string }) => {
    const hashInput = `${MERCHANT_KEY_TEST}|${txnId}|${amount.toString()}|${productinfo}|${firstname}|${email}|||||||||||${SALT_KEY_TEST}`;
    console.log('hashInput: ', hashInput);
    const hashString = CryptoJs.SHA512(hashInput);

    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    console.log('data: ', data);
    
    const hashBuffer =  CryptoJs.SHA512(hashInput).toString();
    console.log('hashBuffer: ', hashBuffer);
    
    // const hashBuffer =  sha512.digest(hashInput);
    // console.log('hashBuffer: ', hashBuffer);
    // const hashArray = Array.from(new Uint8Array(hashBuffer));
    // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // console.log('hashHex: ', hashHex);
    // return hashHex.toString();
    return hashBuffer;
}

export const generateTxnId = (firstName?: string, email?: string) => {
    const timestamp = Date.now();
    const combinedString = `${generateSecureRandomString(16)}${generateRandomEmailWithUUID()}${timestamp}`;
    const hashString = CryptoJs.SHA512(combinedString).toString();
    console.log('hashString: ', hashString);

    // const uniqueId = hashString ? hashString.substring(0, 15) : '';
    const uniqueId = hashString ? 'T' + hashString.replace(/\D/g, '').substring(0, 20) : '';
    console.log('uniqueId: ', uniqueId); 

    return uniqueId;
}

const generateSecureRandomString = (length: number) => {
    const randomBytes = CryptoJs.lib.WordArray.random(length);
    const convertedRandomBytes = randomBytes.toString(CryptoJs.enc.Hex);
    return convertedRandomBytes;
}

function generateUUID() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateRandomEmailWithUUID() {
    const username = generateUUID();
    const domain = DOMAIN + '.com';
    return `${username}@${domain}`;
}


export interface Payment {
    txnId: string;
    productinfo: string;
    amount: string;
    email: string;
    firstname: string;
    lastname?: string;
    phone: string;
}

export class PaymentProvider {
    key: string;
    txnId: string;
    productinfo: string;
    amount: string;
    email: string;
    firstname: string;
    phone: string;

    constructor(
        key: string = MERCHANT_KEY_TEST,
        txnId: string,
        productinfo: string,
        amount: string,
        email: string,
        firstname: string,
        phone: string,
    ) {
        this.key = key;
        this.txnId = txnId
        this.productinfo = productinfo
        this.amount = amount
        this.email = email
        this.firstname = firstname
        this.phone = phone
    }
}