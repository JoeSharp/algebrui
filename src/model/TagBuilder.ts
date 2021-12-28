import { WithUuid } from './MathMLModel';
import Tree from './Tree';

export interface TagBuilderProducer {
    buildTag(): TagBuilder;
}

export const getColorTag = (colour: string): TagBuilder => {
    return new TagBuilder('mstyle')
        .withAttribute('displaystyle', 'true')
        .withAttribute('mathcolor', colour);
}

class TagBuilder extends WithUuid {
    tag: string | undefined;
    attributes: {
        [key: string]: string;
    }
    contents: string;
    children: TagBuilder[];

    constructor(tag: string | undefined = undefined) {
        super();
        this.tag = tag;
        this.attributes = {};
        this.contents = '';
        this.children = [];
    }

    withAttribute(key: string, value: string): TagBuilder {
        this.attributes[key] = value;
        return this;
    }

    withContents(contents: string): TagBuilder {
        this.contents = contents;
        return this;
    }

    withChild(child: TagBuilder): TagBuilder {
        this.children.push(child);
        return this;
    }

    withOptionalChild(condition: boolean, child: TagBuilder): TagBuilder {
        if (condition) {
            return this.withChild(child);
        }
        return this;
    }

    findAndWrap(uuid: string | undefined, wrapper: TagBuilder): TagBuilder {
        if (uuid === undefined) return this;
        if (uuid === this.uuid) return wrapper.withChild(this);
        this.children = this.children.map(c => c.findAndWrap(uuid, wrapper));
        return this;
    }

    withChildren(children: TagBuilder[]): TagBuilder {
        this.children.push(...children);
        return this;
    }

    generateTree(): Tree {
        return new Tree(this.uuid).withChildren(...this.children.map(c => c.generateTree()))
    }

    generateXML(): string {
        const attributes = Object.entries(this.attributes).map(([key, value]) => `${key}="${value}"`);
        const attrstr = attributes.length > 0 ? ' ' + attributes.join(' ') : '';

        if (this.tag === undefined) {
            return `${this.contents}
            ${this.children.map(c => c.generateXML()).join('\n')}`
        } else {
            return `<${this.tag}${attrstr}>
            ${this.contents}
            ${this.children.map(c => c.generateXML()).join('\n')}
        </${this.tag}>`
        }
    }
}

export default TagBuilder;