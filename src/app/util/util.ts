import { faHome, faBlog, faCalendarDays, faEllipsis, faExclamationCircle, faAddressBook, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ClickEvent, MoveDirection, OutMode } from "@tsparticles/engine";
import * as CryptoJs from 'crypto-js';
// import { sha512 } from 'js-sha512';
import { DOMAIN } from './theme';
import { environment } from 'src/environments/environment';
import { AbstractControl, ValidatorFn } from '@angular/forms';

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
export let PAYMENT_OBJECT: any = {};

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


export const dropdownValidator = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (!value || value === '') {
            return { 'required': true };
        }
        return null;
    };
}

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

export function setPaymentObject(payment: Payment) {
    const paymentResponse = `${window.location.href}response`;
    const { txnid, amount, productinfo, email, firstname, lastname, phone } = payment;
    genertateHash({ txnid, amount, productinfo, firstname, email, phone });
    PAYMENT_OBJECT = payment;
    PAYMENT_OBJECT['hash'] = HASH_STRING;
}


export const paymentHtmlPayload = (payment: Payment) => {
    const paymentResponse = `http://localhost:4200/payment`;
    // const paymentResponse = `https://8d45-106-51-37-15.ngrok-free.app/payment/payu-confirm/RMAXZ4/`;
    const { txnid, amount, productinfo, email, firstname, phone, surl, furl, hash } = payment;
    // key, txnid, amount, productinfo, firstname, email, phone, surl, furl, hash
    const htmlBody = `
    <html>
    <body>
    <form action='${environment.paymentTestingUrl}' method="POST" id="payu_form">
    <input type="hidden" name="key" value="${MERCHANT_KEY_TEST}" />
    <input type="hidden" name="txnid" value="${txnid}" />
    <input type="hidden" name="amount" value="${amount}" />
    <input type="hidden" name="productinfo" value="${productinfo}" />
    <input type="hidden" name="firstname" value="${firstname}" />
    <input type="hidden" name="email" value="${email}" />
    <input type="hidden" name="phone" value="${phone}” />
    <input type="hidden" name="furl" value="${furl}" />
    <input type="hidden" name="surl" value="${surl}" />
    <input type="hidden" name="udf1" value="data1" />
    <input type="hidden" name="udf2" value="data2" />
    <input type="hidden" name="udf3" value="data3" />
    <input type="hidden" name="udf4" value="data4" />
    <input type="hidden" name="udf5" value="data5" />
    <input type="hidden" name="hash" value="${hash}" />
    </form>
    <p>Redirecting....</p>
    <script type="text/javascript">
            document.getElementById("payu_form").submit();
    </script>
    </body>
    </html>
    `;

    return htmlBody;
}

const genertateHash = ({ txnid, amount, productinfo, firstname, email, phone }: { txnid: string, amount: string, productinfo: string, firstname: string, email: string, phone: string }) => {
    const hashInput = `${MERCHANT_KEY_TEST}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${SALT_KEY_TEST}`;
    console.log('hashInput: ', hashInput);
    HASH_STRING = CryptoJs.SHA512(hashInput).toString();
}

export function verifyPaymentHash({ command, txnid }: { command: string, txnid: string }): string {
    const hashInput = MERCHANT_KEY_TEST + "|" + command + "|" + txnid + "|" + SALT_KEY_TEST;

    const hashStringHex = CryptoJs.SHA512(hashInput).toString(CryptoJs.enc.Hex);

    return hashStringHex;
}

export const generateTxnId = (firstName?: string, email?: string) => {
    const timestamp = Date.now();
    const combinedString = `${generateSecureRandomString(16)}${generateRandomEmailWithUUID()}${timestamp}`;
    const hashString = CryptoJs.SHA512(combinedString).toString();
    // const uniqueId = hashString ? hashString.substring(0, 15) : '';
    const uniqueId = hashString ? 'TXN' + hashString.replace(/\D/g, '').substring(0, 16) : '';
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
    txnid: string;
    productinfo: string;
    amount: string;
    email: string;
    firstname: string;
    lastname?: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
}

export class PaymentProvider {
    key: string;
    txnId: string;
    productinfo: string;
    amount: string;
    email: string;
    firstname: string;
    phone: string;
    hash: string;

    constructor(
        key: string = MERCHANT_KEY_TEST,
        txnId: string,
        productinfo: string,
        amount: string,
        email: string,
        firstname: string,
        phone: string,
        hash: string = HASH_STRING
    ) {
        this.key = key;
        this.txnId = txnId;
        this.productinfo = productinfo;
        this.amount = amount;
        this.email = email;
        this.firstname = firstname;
        this.phone = phone;
        this.hash = hash;
    }
}
