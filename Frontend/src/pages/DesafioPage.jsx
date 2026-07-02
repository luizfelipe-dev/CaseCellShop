function DesafioPage() {
  return (
    <main className="app__main page">
      <section className="page-panel desafio-page">
        <div className="section-heading">
          <h2>Desafio</h2>
          <p>II. Desafio - Pleno (Full Stack)</p>
        </div>

        <div className="desafio-page__viewer">
          <iframe
            title="II. Desafio - Pleno (Full Stack)"
            src="/desafio.pdf"
            className="desafio-page__pdf"
          />
        </div>
      </section>
    </main>
  );
}

export default DesafioPage;
