import MathMLModel from "./MathMLModel";
import TagBuilder from "./TagBuilder";
import Term from "./Term";
import Tree from "./Tree";

class Expression extends MathMLModel {
    terms: Term[];

    constructor(terms: Term[] = []) {
        super();
        this.terms = terms.map(t => t.copy());
    }

    addTerm(term: Term): Expression {
        this.terms.push(term);
        return this;
    }

    buildTag(): TagBuilder {
        return new TagBuilder('mrow')
            .withUuid(this.uuid)
            .withChildren(this.terms.map(t => t.buildTag()));
    }

    generateTree(): Tree {
        return new Tree(this.uuid).withChildren(...this.terms.map(t => t.generateTree()));
    }

    copy(): Expression {
        return new Expression(this.terms).withUuid(this.uuid);
    }
}

export const DEFAULT_EXPRESSION = new Expression();

export default Expression;