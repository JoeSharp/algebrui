import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap'

import { EquationSide } from '../model/';

interface Props {
    value: EquationSide,
    onChange: (value: EquationSide) => void;
}

const NAMED_SIDES = [
    { name: 'Left', side: EquationSide.left },
    { name: '=', side: EquationSide.both },
    { name: 'Right', side: EquationSide.right }
];

const EquationSideSelector: React.FunctionComponent<Props> = ({ value, onChange }) => {
    const nameSidesWithHandlers = React.useMemo(() =>
        NAMED_SIDES.map(namedSide => ({ namedSide, onSelect: () => onChange(namedSide.side) }))
        , [onChange])

    return <ButtonGroup>
        {nameSidesWithHandlers
            .map(({ namedSide: { name, side }, onSelect }) =>
                <Button key={side} variant={value === side ? 'primary' : 'secondary'} onClick={onSelect} >{name}</Button>)}
    </ButtonGroup>
}

export default EquationSideSelector;