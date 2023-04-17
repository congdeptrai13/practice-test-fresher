import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
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

const Layout = ()=>{
  return (
    <>
    <Header/>
    <Outlet />
    <Footer/>
    </>
  )
}
export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <div>404 not found</div>,
      children: [
      { index: true, element: <Home /> },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "book",
        element: <BookPage />,
      },
    ],
    },
    {
      path: "/login",
      element: <LoginPage/>,
      errorElement: <div>404 not found</div>,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
      errorElement: <div>404 not found</div>,
    },

  ]);
  return (
    <div>
        <RouterProvider router={router} />
    </div>
  );
}
