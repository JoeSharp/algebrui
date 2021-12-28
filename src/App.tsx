import React from 'react';

import Container from 'react-bootstrap/Container';
import EquationBuilder from './components/EquationBuilder';

const App: React.FunctionComponent = () => {


  return (
    <Container>
      <h1>Algebra Explorer</h1>

      <EquationBuilder />
    </Container>
  );
}

export default App;
