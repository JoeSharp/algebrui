import { TagBuilderProducer } from "./TagBuilder";
import { v4 as uuidv4 } from 'uuid';
import Tree from "./Tree";

export abstract class WithUuid {
    uuid: string;
    constructor() {
        this.uuid = uuidv4();
    }

    withUuid(uuid: string): this {
        this.uuid = uuid;
        return this;
    }
}

abstract class MathMLModel extends WithUuid implements TagBuilderProducer {
    abstract generateTree(): Tree;
}
interface MathMLModel extends TagBuilderProducer { }

export default MathMLModel;