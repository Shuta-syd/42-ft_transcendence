import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactQueryComponent from "../../components/sample/ReactQuery";

const queryClient = new QueryClient();

function Game() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryComponent />
    </QueryClientProvider>
  );
}

export default Game;
