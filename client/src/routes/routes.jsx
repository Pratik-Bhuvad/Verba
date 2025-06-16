import About from "../pages/About";
import Auth from "../pages/Auth";
import Blogs from "../pages/Blogs";
import Home from "../pages/Home";

const routes = [
    {
        path: '/',
        component: <Home />,
        exact: true
    },
    {
        path: '/about',
        component: <About />,
        exact: true
    },
    {
        path: '/blogs',
        component: <Blogs />,
        exact: true
    },
    {
        path: '/auth',
        component: <Auth />,
        exact: true
    }
]

export default routes