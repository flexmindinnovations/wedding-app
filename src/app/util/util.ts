import { faHome, faBlog, faCalendarDays, faEllipsis, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

const homeIcon = faHome;
const blogIcon = faBlog;
const calenderIcon = faCalendarDays;

export const tabItems = {
    displayed: [
        {
            "id": 1,
            "title": "Home",
            "route": "home",
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