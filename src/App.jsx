import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useOutletContext,
} from "react-router-dom";
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import Header from './components/header';
import { Outlet } from "react-router-dom";
import Footer from './components/footer';
import BookPage from './pages/book';
import Home from './components/home';
import RegisterPage from './pages/register';
import "./styles/app.css"
import { fetchInfoUser } from './services/userServices';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import NotFoundPage from './pages/notFound';
import LoadingComponent from './components/loading';
import AdminPage from './pages/admin';
import Protected from './components/protected';
import LayoutAdmin from './components/layoutAdmin';
import FooterComponent from './components/footer';
import TableUser from './components/layoutAdmin/user/TableUser';
import TableBook from './components/layoutAdmin/book/TableBook';
import OrderPage from './pages/order';
import HistoryPage from './pages/history';
import TableOrder from './components/layoutAdmin/order/TableOrder';

const Layout = ()=>{
  const [searchNav, setSearchNav] = useState("")
  return (
    <div style={{minHeight:"100vh"}}>
    <Header searchNav={searchNav} setSearchNav={setSearchNav}/>
    <Outlet context={[searchNav, setSearchNav]}/>
    <FooterComponent/>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading)
  //stateless
  useEffect(()=>{
    getInfoUser();
  },[])

  const getInfoUser = async()=>{
    if(window.location.pathname === "/login" || window.location.pathname === "/register") return;
    const res = await fetchInfoUser();
    dispatch(doGetAccountAction(res.data))
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <NotFoundPage/>,
      children: [
      { index: true, element: <Home /> },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "book/:slug",
        element: <BookPage />,
      },
      {
        path:"order",
        element: <OrderPage/>
      },
      {
        path:"history",
        element: <HistoryPage/>
      }
      

    ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFoundPage/>,
      children: [
      { index: true, element: 
      <Protected>
        <AdminPage />
      </Protected>
      },
      {
        path: "user",
        element: <TableUser />,
      },
      {
        path: "book",
        element: <TableBook />,
      },
      {
        path:"order",
        element:<TableOrder/>
      }
    ],
    },
    {
      path: "/login",
      element: <LoginPage/>,
      errorElement: <NotFoundPage/>,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
      errorElement: <NotFoundPage/>,
    },

  ]);
  return (
    <div>
        {isLoading === false || window.location.pathname === "/login" || window.location.pathname === "/register" || window.location.pathname === "/"
        ?
        <RouterProvider router={router} />
        :
        <LoadingComponent/>
      }
        
    </div>
  );
}
