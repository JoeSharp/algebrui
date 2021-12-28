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
import TagBuilder, { getColorTag } from '../model/TagBuilder';
import Tree, { Direction } from '../model/Tree';

interface Props {

}

interface AddTermAction {
    type: 'addTerm',
    term: Term,
    equationSide: EquationSide
}

interface NavigateAction {
    type: 'navigate',
    direction: Direction
}

type EquationAction = AddTermAction | NavigateAction;

interface EquationState {
    selectedUuid: string | undefined;
    equation: Equation,
    mathml: string;
}

const ROOT_UUID = 'root';

const equationReducer = (state: EquationState, action: EquationAction): EquationState => {
    // We will use the existing equation if we can
    let equation = state.equation;
    let selectedUuid = state.selectedUuid;

    if (action.type === 'addTerm') {
        // Create a copy of the equation if we are modifying it
        equation = state.equation.copy();
        equation.addTerm(action.term, action.equationSide);
    }
    // Regenerate the Math ML tag tree
    let mathMLTag = equation.buildTag();

    if (action.type === 'navigate') {
        const tree: Tree = equation.generateTree();
        selectedUuid = tree.navigate(selectedUuid, action.direction);
    }

    // Wrap the selected item so it is styled red
    mathMLTag = mathMLTag.findAndWrap(selectedUuid, getColorTag('red'));
    const mathml = new TagBuilder('math')
        .withUuid(ROOT_UUID)
        .withChild(mathMLTag)
        .generateXML();

    return {
        selectedUuid,
        equation,
        mathml
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
    selectedUuid: undefined,
    equation: INITIAL_EQUATION,
    mathml: new TagBuilder('math').withChild(
        new TagBuilder('mtable').withChild(
            INITIAL_EQUATION.buildTag()
        )
    ).generateXML()
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

    React.useEffect(() => {
        const keyDown = ({ key }: KeyboardEvent) => {
            switch (key) {
                case 'ArrowUp':
                    dispatch({ type: 'navigate', direction: Direction.up })
                    break;
                case 'ArrowDown':
                    dispatch({ type: 'navigate', direction: Direction.down })
                    break;
                case 'ArrowLeft':
                    dispatch({ type: 'navigate', direction: Direction.left })
                    break;
                case 'ArrowRight':
                    dispatch({ type: 'navigate', direction: Direction.right })
                    break;
            }
        };
        document.addEventListener('keydown', keyDown);

        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    }, [])

    return (<>
        <MathComponent mathml={mathml} />
        <EquationSideSelector value={equationSide} onChange={setEquationSide} />
        <div>
            <TermBuilder onCommit={onAddTerm} />
        </div>
    </>)
}

export default EquationBuilder;