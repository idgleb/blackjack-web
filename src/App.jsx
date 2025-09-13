import React from 'react';
import MesaJuego from './components/MesaJuego';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <MesaJuego />
      </ErrorBoundary>
    </div>
  );
}

export default App;