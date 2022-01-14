import APIService from "APIService";
import { createContext, useContext, useMemo, useState } from "react";

interface VisualizerContextInterface {
    owner: string;
    repo: string;
    api?: APIService;
}

const VisualizerContext = createContext<VisualizerContextInterface>({
    owner: "pytorch",
    repo: "pytorch",
});

export const VisualizerProvider: React.FC = ({ children }) => {
    const [owner, setOwner] = useState<string>("pytorch");
    const [repo, setRepo] = useState<string>("pytorch");

    const api: APIService = useMemo(() => {
        return new APIService(owner, repo);
    }, [owner, repo]);

    return (
        <VisualizerContext.Provider value={{ owner, repo, api }}>
            {children}
        </VisualizerContext.Provider>
    );
};

export const useVisualizer = () => {
    const utils = useContext<VisualizerContextInterface>(VisualizerContext);
    return utils;
};
