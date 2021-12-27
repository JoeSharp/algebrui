import IMathML from "./IMathML";
import Variable from "./Variable";

class Term implements IMathML {
    coefficient: number;
    variables: Variable[];

    constructor(coefficient: number = 1, variables: Variable[] = []) {
        this.coefficient = coefficient;
        this.variables = variables.map(v => v.copy());
    }

    addVariable(variable: Variable): Term {
        this.variables.push(variable);
        return this;
    }

    copy(): Term {
        return new Term(this.coefficient, this.variables);
    }

    generateMathML(): string {
        let sign = this.coefficient > 0 ? '+' : '-';
        let coeff = (this.coefficient === 1 && this.variables.length > 0) ? '' : `<mn>${this.coefficient}</mn>`;
        let variables = this.variables.map(v => v.generateMathML()).join('');

        return `<mo>${sign}</mo>${coeff}${variables}`;
    }
}

export const DEFAULT_TERM = new Term();

export default Term;