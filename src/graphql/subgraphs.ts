export enum Network {
    AVAX,
    ETHER,
}

export enum SubgraphType {
    MAIN,
    REWARD,
}

export function getNetwork(name: string): Network {
    switch (name) {
        case 'avax':
            return Network.AVAX;
        case 'ether':
            return Network.ETHER;
        default:
            return Network.ETHER; // Unsupported network, return ether by default
    }
}

type ChainSubgraphs = {
    mainUrl: string;
    rewardUrl?: string;
};

type Subgraphs = {
    ether: ChainSubgraphs;
    avax: ChainSubgraphs;
};

export const subgraphs: Subgraphs = {
    ether: {
        mainUrl: 'https://api.thegraph.com/subgraphs/name/ngfam/pendle',
        rewardUrl: 'https://api.thegraph.com/subgraphs/name/ngfam/pendle-reward',
    },
    avax: {
        mainUrl: 'https://api.thegraph.com/subgraphs/name/ngfam/pendle-avalanche',
    },
};
