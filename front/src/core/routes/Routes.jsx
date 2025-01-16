import {createBrowserRouter} from "react-router-dom";
import {MainPage} from "../../ui/pages/mainPage/MainPage.jsx";
import {ProfilePage} from "../../ui/pages/profilePage/ProfilePage.jsx";

const routes = [{path:"/",element:<MainPage/>},
    {path:"/profile",element:<ProfilePage/>},];
const router = createBrowserRouter(routes);
export {router}
