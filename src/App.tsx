import { Fragment } from "react";
import Layout from "./components/layout";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Fragment>
        <Layout />
      </Fragment>
    </QueryClientProvider>
  );
}

export default App;
