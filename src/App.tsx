import './App.css'

function App() {
  return (
    <div className="app">
      <div className="hero">
        <div className="title-container">
          <h1 className="title">Eternalys</h1>
          <p className="subtitle">Un voyage au-delà du temps</p>
        </div>
        
        <div className="ornament">
          <span className="rune">✧</span>
          <span className="line"></span>
          <span className="rune">⚜</span>
          <span className="line"></span>
          <span className="rune">✧</span>
        </div>

        <p className="description">
          Bienvenue dans Eternalys, un jeu de rôle épique où vos choix 
          façonnent le destin de mondes entiers. Explorez des contrées 
          mystérieuses, forgez des alliances légendaires et affrontez 
          les ténèbres qui menacent l'équilibre universel.
        </p>

        <div className="cta-container">
          <button className="cta-button primary">
            Commencer l'Aventure
          </button>
          <button className="cta-button secondary">
            En savoir plus
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>Créé par Antoine Eymard</p>
        <p className="copyright">Eternalys © 2024</p>
      </footer>
    </div>
  )
}

export default App

