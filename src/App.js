import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import ToDoList from "./pages/ToDoList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/todolist" element={<ToDoList />} />
        
        <Route path="*" element={<AboutUs />} />
        {/* <Route path="*" element={<AboutUs />} />
        avec le * fait uqe si on va sur une page qui n'existe pas, on va sur AboutUs
         */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
