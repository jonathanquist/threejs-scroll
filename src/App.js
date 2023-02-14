//import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

import Canvas from "./content/Canvas";
import Page from "./content/Page";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <>
      <Canvas />
      <Page />
    </>
  );
}

export default App;
