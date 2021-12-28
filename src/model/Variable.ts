import MathMLModel from "./MathMLModel";
import TagBuilder from "./TagBuilder";
import Tree from "./Tree";

class Variable extends MathMLModel {
    letter: string;
    power: number;

    constructor(letter: string, power: number = 1) {
        super();
        if (letter.length !== 1) throw new Error('Maths Variables must be single letter')

        this.letter = letter;
        this.power = power;
    }

    generateTree(): Tree {
        return new Tree(this.uuid);
    }

    copy(): Variable {
        return new Variable(this.letter, this.power).withUuid(this.uuid);
    }

    incrementPower(amount: number): Variable {
        this.power += amount;
        return this;
    }

    setPower(power: number): Variable {
        this.power = power;
        return this;
    }

    buildTag(): TagBuilder {
        if (this.power === 1) {
            return new TagBuilder('mi')
                .withUuid(this.uuid)
                .withContents(this.letter);
        } else {
            return new TagBuilder('msup')
                .withUuid(this.uuid)
                .withChild(new TagBuilder('mi')
                    .withUuid(`${this.uuid}-letter`)
                    .withContents(this.letter))
                .withChild(new TagBuilder('mn')
                    .withUuid(`${this.uuid}-power`)
                    .withContents(this.power.toString(10)))
        }
    }
}

export default Variable;