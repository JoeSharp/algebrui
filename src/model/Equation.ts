
import Expression, { DEFAULT_EXPRESSION } from "./Expression";
import Term from './Term';
import IMathML from "./IMathML";

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

    addTerm(term: Term): Equation {
        this.left.addTerm(term);
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