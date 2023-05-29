import React from "react";
import { useRoutes } from "react-router-dom";
import Routes from "./routes";

export default function App() {
  const element = useRoutes(Routes);
  return element;
}
