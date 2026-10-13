import { render } from "@solidjs/web";
import { Router } from "./router";
import Layout from "./components/Layout";
import "./styles.css";

render(
  () => <Router>{(props) => <Layout>{props.children}</Layout>}</Router>,
  document.getElementById("root")!,
);
