import type { ButtonHTMLAttributes } from 'react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'};
export function Button({variant='primary',className='',...props}:Props){return <button {...props} className={'min-h-12 rounded-2xl px-6 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 '+(variant==='primary'?'bg-primary text-white hover:brightness-110':'border border-line bg-surface text-primary hover:bg-background')+' '+className}/>}
