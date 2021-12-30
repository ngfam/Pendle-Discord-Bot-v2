import { assert } from 'console';
import { request } from 'graphql-request';

export type SubgraphArgs = Record<string, number | string>;

export class SubgraphQuery {
    graphqlQuery: string;
    args: SubgraphArgs;

    public constructor(graphqlQuery: string) {
        this.graphqlQuery = graphqlQuery;
        this.args = {};
    }

    stringWrap(str: string | number): string {
        return `\"${str}\"`;
    }

    getQuery(): string {
        let result: string = '';
        for (let i = 0; i < this.graphqlQuery.length; ++i) {
            if (this.graphqlQuery.charAt(i) == '#') {
                assert(this.graphqlQuery.charAt(i + 1) == '{');
                let j: number = i + 2;
                let variable: string = '';
                while (this.graphqlQuery.charAt(j) != '}') {
                    variable += this.graphqlQuery.charAt(j);
                    j++;
                }
                if (typeof this.args[variable] === 'string') {
                    result += this.stringWrap(this.args[variable]);
                } else {
                    result += this.args[variable];
                }
                i = j;
            } else {
                result += this.graphqlQuery.charAt(i);
            }
        }
        return result;
    }

    async query(subgraph: string, args: SubgraphArgs): Promise<any> {
        this.args = args;
        return await request(subgraph, this.getQuery());
    }
}
