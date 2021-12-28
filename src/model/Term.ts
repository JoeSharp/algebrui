import MathMLModel from "./MathMLModel";
import TagBuilder from "./TagBuilder";
import Tree from "./Tree";
import Variable from "./Variable";

class Term extends MathMLModel {
    coefficient: number;
    variables: Variable[];

    constructor(coefficient: number = 1, variables: Variable[] = []) {
        super();
        this.coefficient = coefficient;
        this.variables = variables.map(v => v.copy());
    }

    addVariable(variable: Variable): Term {
        this.variables.push(variable);
        return this;
    }

    generateTree(): Tree {
        return new Tree(this.uuid).withChildren(...this.variables.map(v => v.generateTree()));
    }

    copy(): Term {
        return new Term(this.coefficient, this.variables).withUuid(this.uuid);
    }

    buildTag(): TagBuilder {
        return new TagBuilder()
            .withUuid(this.uuid)
            .withChild(new TagBuilder('mo')
                .withUuid(`${this.uuid}-sign`)
                .withContents(this.coefficient > 0 ? '+' : '-'))
            .withOptionalChild(this.coefficient !== 1 || this.variables.length === 0,
                new TagBuilder('mn')
                    .withUuid(`${this.uuid}-coeff`)
                    .withContents(this.coefficient.toString(10)))
            .withChildren(
                this.variables.map(v => v.buildTag())
            );
    }
}

export const DEFAULT_TERM = new Term();

export default Term;