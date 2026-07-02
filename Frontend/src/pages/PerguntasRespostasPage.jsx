import content from '../../../Desafio_Parte_1A.MD?raw';

function formatContent(text) {
  return text
    .split('\n')
    .map((line) => {
      if (line.startsWith('### ')) {
        return `<h3>${line.slice(4)}</h3>`;
      }

      if (line.startsWith('## ')) {
        return `<h2>${line.slice(3)}</h2>`;
      }

      if (line.startsWith('<h')) {
        return line;
      }

      if (!line.trim()) {
        return '<br />';
      }

      return `<p>${line}</p>`;
    })
    .join('');
}

function PerguntasRespostasPage() {
  return (
    <main className="app__main page">
      <section className="page-panel perguntas-page">
        <div className="section-heading">
          <h2>Perguntas e Respostas</h2>
          <p>Parte 1.A — Perguntas Conceituais</p>
        </div>

        <article
          className="perguntas-page__content"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </section>
    </main>
  );
}

export default PerguntasRespostasPage;
