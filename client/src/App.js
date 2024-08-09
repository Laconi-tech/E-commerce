import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ArticleList from "./components/articles/ArticleList";
import ArticleDetails from "./components/articles/ArticleDetails";
// import ModifyCategories from './ModifyCategories';
import AddArticle from "./components/admin/AddArticle";
import PopularArticle from "./components/articles/PopularArticle";
import ModifArticle from "./components/admin/ModifArticle";
import ModifArticleDetails from "./components/admin/ModifArticleDetail";
import ModifyCategories from "./components/admin/ModifyCategories";
import RegisterForm from "./components/account/RegisterForm.js";
// import AddArticle from './AddArticle';
import LoginForm from "./components/account/LoginForm";
import PanierView from "./components/articles/PanierView";
import ProfileComponent from "./components/account/Profil";
import Commentaire from "./components/commentaire/Comment";
import RegistrationForm2 from "./components/account/RegisterForm2";
import LoginFormW from "./components/account/LoginFormw";
import PaymentForm from "./components/account/Payment";
import PaymentV from "./components/account/PaymentV";
import Recap from "./components/account/Recap";
import OrdersList from "./components/orders/OrdersList";
import ProfileUpdateForm from "./components/account/ProfileUpdateForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register-form" element={<RegisterForm />}></Route>
          <Route path="/register-form2" element={<RegistrationForm2 />} />
          <Route path="/article-listing" element={<ArticleList />} />
          <Route path="/add" element={<AddArticle />} />
          <Route path="/article-details/:id" element={<ArticleDetails />} />
          <Route path="/" element={<PopularArticle />} />
          <Route path="/modif" element={<ModifArticle />} />
          <Route path="/modif-article-details/:id" element={<ModifArticleDetails />} />
          <Route path="/article" element={<ArticleList />} />
          <Route path="/article-details/:id" element={<ArticleDetails />} />
          <Route path="/modify_categories" element={<ModifyCategories />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login2" element={<LoginFormW />} />
          <Route path="/panier" element={<PanierView />} />
          <Route path="/profil" element={<ProfileComponent />} />
          <Route path="/Payment" element={<PaymentForm />} />
          <Route path="/Payment2" element={<PaymentV />} />
          <Route path="/Recap" element={<Recap />} />
          <Route path="/orders-list" element={<OrdersList />} />
          <Route path="/update" element={<ProfileUpdateForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
