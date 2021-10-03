import { lazy, Suspense } from "react";
import "./App.scss";

const Homepage = lazy(() => import("./pages/homepage/Homepage"));
const Todo = lazy(() => import("./pages/todo/Todo"));

function App() {
  return (
    <Suspense fallback="Loading....">
      <Homepage />
      <Todo />
    </Suspense>
  );
}

export default App;
