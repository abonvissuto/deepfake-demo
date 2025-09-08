import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import UploaderScene from "./components/UploaderScene";

function App() {
  return (
    <ThemeProvider>
      <UploaderScene />
    </ThemeProvider>
  );
}

export default App;
