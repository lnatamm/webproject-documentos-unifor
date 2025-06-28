import React from 'react';
import DownloadCard from './components/DownloadCard';
import downloadCards from './cards/downloadCards';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Download de Documentos - UNIFOR</h1>
      </header>
      <div id="root">
        <div className="card-container">
          {downloadCards.map((card, index) => (
            <DownloadCard key={index} title={card.title} options={card.options} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;