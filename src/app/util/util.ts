import { faHome, faBlog, faCalendarDays, faEllipsis, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { ClickEvent, MoveDirection, OutMode } from "@tsparticles/engine";

const homeIcon = faHome;
const blogIcon = faBlog;
const calenderIcon = faCalendarDays;

export const SLIDE_INTERVAL = 4000;

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
        {
            "id": 3,
            "title": "Events",
            "route": "events",
            "isActive": false,
            "icon": calenderIcon
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
            "id": 1,
            "title": "About",
            "route": "about",
            "isActive": false
        },
    ]
}

export const MENU_ITEMS = [
    {
        "id": 6,
        "title": "Blogs",
        "route": "blog",
        "isActive": false,
        "icon": blogIcon
    },
    {
        "id": 7,
        "title": "Events",
        "route": "events",
        "isActive": false,
        "icon": calenderIcon
    },
    {
        "id": 8,
        "title": "About",
        "route": "about",
        "isActive": false,
        "icon": faExclamationCircle
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
                zIndex:0
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