import { LoginPage } from "./LoginPage";
import { GaymPage } from "./GaymPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/game" element={<GaymPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
