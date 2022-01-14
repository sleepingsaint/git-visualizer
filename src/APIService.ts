import { Branch, Commit, Repo, Tree } from "types";

class APIService {
    private owner: string;
    private repo: string;
    private branchesPerPage: number;
    private commitsPerPage: number;

    constructor(
        owner: string,
        repo: string,
        branchesPerPage = 5,
        commitsPerPage = 5
    ) {
        this.owner = owner;
        this.repo = repo;
        this.branchesPerPage = branchesPerPage;
        this.commitsPerPage = commitsPerPage;
    }

    getRepo(): Promise<Repo> {
        return fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}`
        ).then((data) => data.json());
    }

    getBranches(): Promise<Array<Branch>> {
        return fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/branches?per_page=${this.branchesPerPage}`
        ).then((data) => data.json());
    }

    getCommits(branch: Branch): Promise<Array<Commit>> {
        return fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/commits?sha=${branch.commit.sha}&per_page=${this.commitsPerPage}`
        ).then((data) => data.json());
    }

    getTree(sha: string): Promise<Tree> {
        return fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${sha}`
        ).then((data) => data.json());
    }
}

export default APIService;
