import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryClient, QueryClientProvider } from "react-query";
import FetchComponent from "../../components/sample/fetch";
import ReactQueryComponent from "../../components/sample/ReactQuery";

const queryClient = new QueryClient();

function Game() {
  return (
    <QueryClientProvider client={queryClient}>
      <FetchComponent />
      {/* <ReactQueryComponent /> */}
    </QueryClientProvider>
  );
}

export default Game;
