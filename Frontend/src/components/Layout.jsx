import Header from './Header';
import Nav from './Nav';

function Layout({ children }) {
  return (
    <div className="app">
      <Header />
      <Nav />
      <div className="app__container">{children}</div>
    </div>
  );
}

export default Layout;
