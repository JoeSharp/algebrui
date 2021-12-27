import React from 'react';
import { Button, FormGroup } from 'react-bootstrap';

import Variable from '../model/Variable';

interface Props {
    variable: Variable,
    onUpdate: (letter: string, power: number) => void;
    onRemove: (letter: string) => void;
}

const TermVariableBuilder: React.FunctionComponent<Props> = ({ variable: { letter, power }, onUpdate, onRemove }) => {

    const onPowerChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
        ({ target: { value } }) => onUpdate(letter, parseInt(value))
        , [onUpdate]);

    const onThisRemove = React.useCallback(() => onRemove(letter), [letter, onRemove])

    return (<React.Fragment>
        <FormGroup>
            <label>{letter}</label>
            <input className='form-control' type='number' onChange={onPowerChange} value={power} />
        </FormGroup>
        <Button onClick={onThisRemove}>remove</Button>
    </React.Fragment>)
}

export default TermVariableBuilder;