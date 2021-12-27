import React from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { Term, Variable } from '../model';
import TermVariableBuilder from './TermVariableBuilder';

interface Props {
    onCommit: (term: Term) => void;
}

interface AddVariableAction {
    type: 'add';
}

interface RemoveVariableAction {
    type: 'remove',
    letter: string;
}

interface UpdatePowerAction {
    type: 'update',
    letter: string,
    power: number
}

type VariableAction = AddVariableAction | RemoveVariableAction | UpdatePowerAction;

interface VariablesState {
    availableLetters: string[];
    variables: Variable[]
}

const INITIAL_VARIABLES_STATE: VariablesState = {
    availableLetters: ['x', 'y', 'z', 'a', 'b', 'c'],
    variables: []
}

const variableReducer = (state: VariablesState, action: VariableAction): VariablesState => {
    switch (action.type) {
        case 'add':
            if (state.availableLetters.length === 0) return state;

            let letter = state.availableLetters[0];
            return {
                availableLetters: state.availableLetters.filter(a => a !== letter),
                variables: [
                    ...state.variables,
                    new Variable(letter)
                ]
            }
        case 'remove':
            return {
                availableLetters: [...state.availableLetters, action.letter],
                variables: state.variables.filter(({ letter }) => letter !== action.letter)
            }
        case 'update':
            return {
                ...state,
                variables: state.variables.map(variable => variable.letter !== action.letter ? variable : variable.copy().setPower(action.power))
            }
    }
}

const TermBuilder: React.FunctionComponent<Props> = ({ onCommit }) => {
    // Variable Reducer, and the associated callbacks
    const [{ variables }, dispatchVariables] = React.useReducer(variableReducer, INITIAL_VARIABLES_STATE);
    const onAddVariable = React.useCallback(() => dispatchVariables({ type: 'add' }), []);
    const onUpdateVariable = React.useCallback((letter: string, power: number) => dispatchVariables({ type: 'update', letter, power }), [])
    const onRemoveVariable = React.useCallback((letter: string) => dispatchVariables({ type: 'remove', letter }), [])

    // Editing the coefficient
    const [coefficient, setCoefficient] = React.useState<number>(1);
    const onCoefficientChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
        ({ target: { value } }) => setCoefficient(parseInt(value)),
        [])

    // Confirming this term can be added to whatever owns this component
    const onClickCommit = React.useCallback(
        () => onCommit(new Term(coefficient, variables)),
        [coefficient, variables, onCommit])

    return <>
        <Form>
            <FormGroup>
                <label htmlFor='coeff'>Co-efficient</label>
                <input className='form-control' name='coeff' type='number' onChange={onCoefficientChange} value={coefficient} />
            </FormGroup>

            {variables.map(variable => (
                <TermVariableBuilder
                    key={`variable-${variable.letter}`}
                    variable={variable}
                    onRemove={onRemoveVariable}
                    onUpdate={onUpdateVariable}
                />
            ))}

            <Button onClick={onAddVariable}>Add Variable</Button>
        </Form>
        <Button onClick={onClickCommit}>Add Term</Button>
    </>
}

export default TermBuilder;