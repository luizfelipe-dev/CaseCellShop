import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Produtos', end: true },
  { to: '/pedidos', label: 'Meus Pedidos' },
  { to: '/desafio', label: 'Desafio', alignRight: true },
  { to: '/perguntas-respostas', label: 'Perguntas e Respostas', alignRight: true },
  { to: '/reset', label: 'Resetar', alignRight: true, danger: true },
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
                `main-nav__link ${item.danger ? 'main-nav__link--danger' : ''} ${isActive ? 'main-nav__link--active' : ''}`
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
