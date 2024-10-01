import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './HomePage';
import SignupPage from './SignupPage';
import LoginPage from "./LoginPage";
import CreateItemPage from "./CreateItemPage";
import ItemPage from "./ItemPage";
import OrderSuccessPage from "./OrderSuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/item/new" element={<CreateItemPage />} />
        <Route exact path="/item/:id" element={<ItemPage />} />
        <Route exact path="/item/purchase/:id" element={<OrderSuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
