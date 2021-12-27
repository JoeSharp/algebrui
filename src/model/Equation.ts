
import Expression, { DEFAULT_EXPRESSION } from "./Expression";
import Term from './Term';
import IMathML from "./IMathML";

export enum EquationSide {
    left,
    right,
    both
}

class Equation implements IMathML {
    left: Expression;
    right: Expression;

    constructor(left: Expression = DEFAULT_EXPRESSION,
        right: Expression = DEFAULT_EXPRESSION) {
        this.left = left.copy();
        this.right = right.copy();
    }

    setLeft(left: Expression): Equation {
        this.left = left;
        return this;
    }

    setRight(right: Expression): Equation {
        this.right = right;
        return this;
    }

    addTerm(term: Term, side: EquationSide = EquationSide.both): Equation {
        switch (side) {
            case EquationSide.both:
                this.left.addTerm(term);
                this.right.addTerm(term);
                break;
            case EquationSide.left:
                this.left.addTerm(term);
                break;
            case EquationSide.right:
                this.right.addTerm(term);
                break;
        }
        return this;
    }

    copy() {
        return new Equation(this.left, this.right);
    }

    generateMathML() {
        return `<mtr>
            ${this.left.generateMathML()}
            <mo>=</mo>
            ${this.right.generateMathML()}
        </mtr>`
    }
}

export default Equation;