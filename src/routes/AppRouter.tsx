import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import FAQ from "./faq";


export default function appRouter() {

  return createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/faq",
      element: <FAQ />,
    },
  ]);
}