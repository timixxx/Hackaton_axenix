import "./style.scss";

export const Header = () => {
  return <header className="header">
    <nav className="header__nav">
        <ul className="header__menu-list">
            <li className="header__item"><a href="/" className="header__item_logo">На главную</a></li>
            <li className="header__item"><a href="/" className="header__item_login"></a></li>
        </ul>
    </nav>
  </header>;
};
