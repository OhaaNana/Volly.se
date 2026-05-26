import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import FAQ from "../pages/FaqPage";
import VideoChatRoom from "../pages/VideoChatRoom";

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
    {
      path: "/room/:roomId",
      element: <VideoChatRoom />,
    },
  ]);
}
