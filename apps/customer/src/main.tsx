import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import '@/shared/styles/index.css';
const client=new QueryClient({defaultOptions:{queries:{retry:1,staleTime:60_000,refetchOnWindowFocus:false}}});
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={client}><RouterProvider router={router}/></QueryClientProvider></React.StrictMode>);
