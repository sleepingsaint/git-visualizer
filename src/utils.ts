import { Elements } from "react-flow-renderer";
import { Branch, Commit, Repo, Tree } from "types";

export enum ItemType {
    Repo = 1,
    Branch = 2,
    Commit = 3,
    Tree = 4,
    Blob = 5,
}

const position = {x: 0, y: 0};

// convert repo response to node
export const getRepoElements = (repo: Repo, prev_els: Elements): Elements => {
    return [
        {
            id: repo.id.toString(),
            data: {
                label: repo.full_name,
                type: ItemType.Repo,
                repo: repo,
            },
            position,
        },
    ];
};

// convert branch response to nodes and add edges with repo id
export const getBranchElements = (
    branches: Array<Branch>,
    id: string,
    prev_els: Elements
): Elements => {
    const nodes = branches.map((branch, idx) => {
        return {
            id: branch.commit.sha,
            data: {
                label: branch.name,
                type: ItemType.Branch,
                branch: branch,
            },
            position,
        };
    });
    const edges = branches.map((branch, idx) => ({
        id: `${id}-${branch.commit.sha}`,
        source: id,
        target: branch.commit.sha,
    }));

    return [...prev_els, ...nodes, ...edges];
};

// convert commits response to nodes and add edges with branch id
export const getCommitElements = (
    commits: Array<Commit>,
    id: string,
    prev_els: Elements
): Elements => {
    const nodes = commits.map((commit, idx) => ({
        id: commit.node_id,
        data: {
            label: commit.commit.message,
            type: ItemType.Commit,
            commit: commit,
        },
        position,
    }));
    const edges = commits.map((commit, idx) => ({
        id: `${id}-${commit.node_id}`,
        source: id,
        target: commit.node_id,
    }));

    return [...prev_els, ...nodes, ...edges];
};

// convert tree response to nodes and add edges with its parent id
export const getTreeElements = (
    tree: Tree,
    id: string,
    prev_els: Elements
): Elements => {
    const nodes: Elements = tree.tree.map((obj, idx) => ({
        id: obj.sha,
        data: {
            label: obj.path,
            type: obj.type === "blob" ? ItemType.Blob : ItemType.Tree,
            tree: obj.type === "blob" ? null : obj,
            blob: obj.type === "blob" ? obj : null,
        },
        position,
    }));

    // since tree elements can be same between different elements
    // we prevent creation of them multiple times
    // new_nodes contains only the tree which are created newly
    const prev_ids = prev_els.map(el => el.id);
    const new_nodes = nodes.filter(node => !prev_ids.includes(node.id));

    const edges = tree.tree.map((obj, idx) => ({
        id: `${id}-${obj.sha}`,
        source: id,
        target: obj.sha,
    }));

    return [...prev_els, ...new_nodes, ...edges];
};
