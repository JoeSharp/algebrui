import IMathML from "./IMathML";

class Variable implements IMathML {
    letter: string;
    power: number;

    constructor(letter: string, power: number = 1) {
        if (letter.length !== 1) throw new Error('Maths Variables must be single letter')

        this.letter = letter;
        this.power = power;
    }

    copy(): Variable {
        return new Variable(this.letter, this.power);
    }

    incrementPower(amount: number): Variable {
        this.power += amount;
        return this;
    }

    setPower(power: number): Variable {
        this.power = power;
        return this;
    }

    generateMathML(): string {
        if (this.power === 1) {
            return `<mi>${this.letter}</mi>`
        } else {
            return `<msup>
                <mi>${this.letter}</mi>
                <mn>${this.power}</mn>
            </msup>`
        }
    }
}

export default Variable;