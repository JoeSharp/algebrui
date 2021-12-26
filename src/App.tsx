import React from 'react';

import Container from 'react-bootstrap/Container';

import { MathComponent } from 'mathjax-react'
import Equation from './model/Equation';
import Expression from './model/Expression';
import Term from './model/Term';
import Variable from './model/Variable';
import TermBuilder from './components/TermBuilder';

interface AbstractEquationAction {
  type: string;
}

interface AddTerm extends AbstractEquationAction {
  type: 'addTerm',
  term: Term
}

type EquationAction = AddTerm;

const equationReducer = (state: Equation, action: EquationAction): Equation => {
  const newState = state.copy();

  switch (action.type) {
    case 'addTerm':
      newState.addTerm(action.term);
      break;
  }

  return newState;
}

const INITIAL_EQUATION: Equation = new Equation()
  .setLeft(new Expression()
    .addTerm(new Term(5)
      .addVariable(new Variable('x', 4))
      .addVariable(new Variable('y', 2))
    )
    .addTerm(new Term(10)
      .addVariable(new Variable('x', 3))
      .addVariable(new Variable('y', 1))
    )
  )
  .setRight(new Expression()
    .addTerm(new Term(5)
      .addVariable(new Variable('x', 7))
      .addVariable(new Variable('z', 4))
    )
  );

const App: React.FunctionComponent = () => {
  const [equation, dispatch] = React.useReducer(equationReducer, INITIAL_EQUATION);

  const equationMathML = React.useMemo(() => `<math><mtable>${equation.generateMathML()}</mtable></math>`, [equation]);

  const onAddTerm = React.useCallback((term: Term) => {
    dispatch({
      type: 'addTerm',
      term
    })
  }, [])

  return (
    <Container>
      <h1>Algebra Explorer</h1>

      <MathComponent mathml={equationMathML} />

      <div>
        <TermBuilder onCommit={onAddTerm} />
      </div>
    </Container>
  );
}

export default App;
