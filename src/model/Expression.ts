import IMathML from "./IMathML";
import Term from "./Term";

class Expression implements IMathML {
    terms: Term[];

    constructor(terms: Term[] = []) {
        this.terms = terms.map(t => t.copy());
    }

    addTerm(term: Term): Expression {
        this.terms.push(term);
        return this;
    }

    generateMathML(): string {
        return `<mtd>${this.terms.map(t => t.generateMathML()).join('')}</mtd>`;
    }

    copy(): Expression {
        return new Expression(this.terms);
    }
}

export const DEFAULT_EXPRESSION = new Expression();

export default Expression;