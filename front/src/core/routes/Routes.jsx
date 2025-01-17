import { createBrowserRouter } from "react-router-dom";
import { MainPage } from "../../ui/pages/mainPage/MainPage.jsx";
import { ProfilePage } from "../../ui/pages/profilePage/ProfilePage.jsx";
import { RegistrationOrAuthorizationPage } from "../../ui/pages/registrationOrAuthorizationPage/RegistrationOrAuthorizationPage.jsx";

const routes = [
  { path: "/", element: <RegistrationOrAuthorizationPage /> },
  { path: "/main", element: <MainPage /> },
  { path: "/profile", element: <ProfilePage /> },
];
const router = createBrowserRouter(routes);
export { router };
