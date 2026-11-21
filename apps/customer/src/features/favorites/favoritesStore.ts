import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FavoritesState={
 ids:string[];
 toggle:(id:string)=>void;
};
export const useFavoritesStore=create<FavoritesState>()(
 persist(
  set=>({
   ids:[],
   toggle:id=>set(s=>({
    ids:s.ids.includes(id)?s.ids.filter(existing=>existing!==id):[...s.ids,id]
   }))
  }),
  {name:'bmp-favorites',storage:createJSONStorage(()=>localStorage)}
 )
);
