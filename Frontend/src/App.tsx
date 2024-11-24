import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminChat from "./pages/AdminChat";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-chat" element={<AdminChat/>} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;