// import dagre from "dagre";
import React, { useEffect, useState } from "react";
import ReactFlow, {
    Controls,
    Elements,
    isNode,
    MiniMap,
    Node,
    Position,
    useStoreState,
    useZoomPanHelper,
} from "react-flow-renderer";
import {
    getBranchElements,
    getCommitElements,
    getRepoElements,
    getTreeElements,
    ItemType,
} from "utils";
import { useVisualizer } from "VisualiserProvider";

const VisualizerBoard: React.FC = () => {
    const [elements, setElements] = useState<Elements>([]);
    const [update, setUpdate] = useState<boolean>(true);

    const { api } = useVisualizer();
    const nodes = useStoreState((state) => state.nodes);
    const { fitBounds } = useZoomPanHelper();

    // helper function to compute the layout of the elements
    // const getLayoutedElements = (els: Elements, nodes: Array<Node>) => {
    //     const dagreGraph = new dagre.graphlib.Graph();
    //     dagreGraph.setDefaultEdgeLabel(() => ({}));

    //     let dimMap = new Map();
    //     nodes.forEach((node) => dimMap.set(node.id, node.__rf));
    //     dagreGraph.setGraph({ ranker: "tight-tree" });

    //     els.forEach((el) => {
    //         if (isNode(el)) {
    //             dagreGraph.setNode(el.id, {
    //                 width: dimMap.get(el.id).width,
    //                 height: dimMap.get(el.id).height,
    //             });
    //         } else {
    //             dagreGraph.setEdge(el.source, el.target);
    //         }
    //     });

    //     dagre.layout(dagreGraph);

    //     const dims = {width: dagreGraph.graph().width, height: dagreGraph.graph().height};

    //     const layoouted_els = els.map((el) => {
    //         if (isNode(el)) {
    //             const nodeWithPosition = dagreGraph.node(el.id);
    //             el.targetPosition = Position.Top;
    //             el.sourcePosition = Position.Bottom;

    //             el.position = {
    //                 x: nodeWithPosition.x - dimMap.get(el.id).width / 2,
    //                 y: nodeWithPosition.y - dimMap.get(el.id).height / 2,
    //             };
    //         }

    //         return el;
    //     });

    //     return {dims, layoouted_els}
    // };

    // update the layout of the nodes
    useEffect(() => {
        if (
            update &&
            nodes.length &&
            nodes.length > 0 &&
            nodes.every((node) => node.__rf.width && node.__rf.height)
        ) {
            // const {dims, layoouted_els} = getLayoutedElements(elements, nodes);
            // setElements(layoouted_els);
            // fitBounds({x: 0, y: 0, width: dims.width ?? 0, height: dims.height ?? 0 });
            // setUpdate(false);
        }
    }, [update, nodes]);

    // by default load pytorch/pytorch repo
    useEffect(() => {
        api?.getRepo()
            .then((repo) => setElements(getRepoElements(repo, [])))
            .catch((err) => console.error("[repo retrieval failed]", err));
    }, []);

    // handle the double click on the node
    // Double Clicking Repo nodes creates the branches
    // Clicking Branches shows the commits
    // Clicking Commit show its corresponding tree
    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        
        if (node.data.type === ItemType.Repo) {
            api?.getBranches().then((branches) => {
                setElements((els) => getBranchElements(branches, node.id, els));
                setUpdate(true);
            });
        } else if (node.data.type === ItemType.Branch) {
            api?.getCommits(node.data.branch).then((commits) => {
                setElements((els) => getCommitElements(commits, node.id, els));
                setUpdate(true);
            });
        } else if (node.data.type === ItemType.Commit) {
            api?.getTree(node.data.commit.sha).then((tree) => {
                setElements((els) => getTreeElements(tree, node.id, els));
                setUpdate(true);
            });
        } else if (node.data.type === ItemType.Tree) {
            api?.getTree(node.data.tree.sha).then((tree) => {
                setElements((els) => getTreeElements(tree, node.id, els));
                setUpdate(true);
            });
        } else if (node.data.type === ItemType.Blob) {
            console.log("[blob]", node.data);
        }
    };

    return (
        <div style={{ height: window.innerHeight, width: window.innerWidth }}>
            <ReactFlow
                elements={elements}
                onNodeDoubleClick={handleNodeClick}
                minZoom={0.1}
            >
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case "input":
                                return "red";
                            case "default":
                                return "#00ff00";
                            case "output":
                                return "rgb(0,0,255)";
                            default:
                                return "#eee";
                        }
                    }}
                    nodeStrokeWidth={3}
                />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default VisualizerBoard;
