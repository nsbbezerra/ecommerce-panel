import { Fragment } from "react";
import Layout from "./components/layout";
import { QueryClientProvider, QueryClient } from "react-query";
import "react-datepicker/dist/react-datepicker.css";
import 'antd/dist/antd.css';

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
