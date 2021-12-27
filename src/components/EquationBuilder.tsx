import React from 'react';

import { MathComponent } from 'mathjax-react'
import {
    Equation,
    EquationSide,
    Expression,
    Term,
    Variable
} from '../model';
import TermBuilder from '../components/TermBuilder';
import EquationSideSelector from './EquationSideSelector';

interface Props {

}

interface AddTerm {
    type: 'addTerm',
    term: Term,
    equationSide: EquationSide
}

type EquationAction = AddTerm;

interface EquationState {
    equation: Equation,
    mathml: string;
}

const equationReducer = (state: EquationState, action: EquationAction): EquationState => {
    const equation = state.equation.copy();

    switch (action.type) {
        case 'addTerm':
            equation.addTerm(action.term, action.equationSide);
            break;
    }

    return {
        equation,
        mathml: `<math><mtable>${equation.generateMathML()}</mtable></math>`
    };
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

const INITAL_EQUATION_STATE: EquationState = {
    equation: INITIAL_EQUATION,
    mathml: `<math><mtable>${INITIAL_EQUATION.generateMathML()}</mtable></math>`
}

const EquationBuilder: React.FunctionComponent<Props> = () => {
    // Which side of the equation are we manipulating?
    const [equationSide, setEquationSide] = React.useState<EquationSide>(EquationSide.both);

    // Equation Math ML and associated callbacks
    const [{ mathml }, dispatch] = React.useReducer(equationReducer, INITAL_EQUATION_STATE);
    const onAddTerm = React.useCallback((term: Term) => {
        dispatch({
            type: 'addTerm',
            term,
            equationSide
        })
    }, [equationSide]);


    return (<>
        <MathComponent mathml={mathml} />
        <EquationSideSelector value={equationSide} onChange={setEquationSide} />
        <div>
            <TermBuilder onCommit={onAddTerm} />
        </div>
    </>)
}

export default EquationBuilder;