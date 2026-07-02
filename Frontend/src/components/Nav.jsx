import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Produtos', end: true },
  { to: '/pedidos', label: 'Meus Pedidos' },
  { to: '/reset', label: 'Resetar', alignRight: true },
];

function Nav() {
  return (
    <nav className="main-nav">
      <ul className="main-nav__list">
        {navItems.map((item) => (
          <li
            key={item.to}
            className={item.alignRight ? 'main-nav__item--right' : undefined}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `main-nav__link ${isActive ? 'main-nav__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
