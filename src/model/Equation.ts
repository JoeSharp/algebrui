
import Expression, { DEFAULT_EXPRESSION } from "./Expression";
import Term from './Term';
import TagBuilder from "./TagBuilder";
import MathMLModel from "./MathMLModel";
import Tree from "./Tree";

export enum EquationSide {
    left,
    right,
    both
}

class Equation extends MathMLModel {
    left: Expression;
    right: Expression;

    constructor(left: Expression = DEFAULT_EXPRESSION,
        right: Expression = DEFAULT_EXPRESSION) {
        super();
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

    generateTree(): Tree {
        return new Tree(this.uuid)
            .withChild(this.left.generateTree())
            .withChild(this.right.generateTree());
    }

    copy() {
        return new Equation(this.left, this.right)
            .withUuid(this.uuid);
    }

    buildTag(): TagBuilder {
        return new TagBuilder('mrow')
            .withUuid(this.uuid)
            .withChild(this.left.buildTag())
            .withChild(new TagBuilder('mo')
                .withUuid(`${this.uuid}-equals`)
                .withContents('='))
            .withChild(this.right.buildTag());
    }
}

export default Equation;