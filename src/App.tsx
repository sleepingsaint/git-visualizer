import VisualizerBoard from "components/VisualizerBoard";
import { ReactFlowProvider } from "react-flow-renderer";
import { VisualizerProvider } from "VisualiserProvider";

function App() {
    return (
        <div className="App">
            <VisualizerProvider>
                <ReactFlowProvider>
                    <VisualizerBoard />
                </ReactFlowProvider>
            </VisualizerProvider>
        </div>
    );
}

export default App;
