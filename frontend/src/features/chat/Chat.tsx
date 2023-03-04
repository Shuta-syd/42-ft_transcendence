import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

function Chat() {
  return (
    <QueryClientProvider client={queryClient}>
        <Outlet />
    </QueryClientProvider>
  );
}

export default Chat;
