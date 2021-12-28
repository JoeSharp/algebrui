export enum Direction {
    up, down, left, right
}

class Tree {
    uuid: string;
    children: Tree[];

    constructor(uuid: string) {
        this.uuid = uuid;
        this.children = [];
    }

    withChild(child: Tree): Tree {
        this.children.push(child);
        return this;
    }

    withChildren(...children: Tree[]): Tree {
        this.children.push(...children);
        return this;
    }

    navigate(selectedUuid: string | undefined, direction: Direction): string | undefined {
        switch (direction) {
            case Direction.up:
                return this.navUp(selectedUuid);
            case Direction.down:
                return this.navDown(selectedUuid);
            case Direction.left:
                return this.navSideways(selectedUuid, -1);
            case Direction.right:
                return this.navSideways(selectedUuid, +1);
        }
    }

    navUp(selectedUuid: string | undefined): string | undefined {
        // If we are the selected UUID, we have clearly popped off the top
        if (this.uuid === selectedUuid) {
            return undefined;
        }

        // If the UUID is any of our children, then we should become the new selected UUID
        if (this.children.findIndex(c => c.uuid === selectedUuid) !== -1) {
            return this.uuid;
        }

        // See if any of our children suggest an alternative
        for (let child of this.children) {
            const suggested = child.navUp(selectedUuid);
            if (suggested !== selectedUuid) {
                return suggested;
            }
        }

        return selectedUuid;
    }
    navDown(selectedUuid: string | undefined): string | undefined {
        if (selectedUuid === undefined) {
            return this.uuid;
        }

        // If we are the selected UUID, we should pick the first child
        if (this.uuid === selectedUuid) {
            if (this.children.length > 0) {
                return this.children[0].uuid;
            } else {
                return selectedUuid;
            }
        }

        // See if any of our children suggest an alternative
        for (let child of this.children) {
            const suggested = child.navDown(selectedUuid);
            if (suggested !== selectedUuid) {
                return suggested;
            }
        }

        return selectedUuid;

    }
    navSideways(selectedUuid: string | undefined, direction: number): string | undefined {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            if (child.uuid === selectedUuid) {
                let newIndex = i + direction;
                if (newIndex < 0) {
                    newIndex = this.children.length - 1;
                } else if (newIndex >= this.children.length) {
                    newIndex = 0;
                }
                return this.children[newIndex].uuid;
            }
        }

        // See if any of our children suggest an alternative
        for (let child of this.children) {
            const suggested = child.navSideways(selectedUuid, direction);
            if (suggested !== selectedUuid) {
                return suggested;
            }
        }

        return selectedUuid;
    }
}

export default Tree;