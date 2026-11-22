import { useNavigate, useParams } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { ProductModal } from '@/shared/ui/ProductModal';

/** Standalone direct links still open as a sheet, against the homepage. */
export function ProductRoutePage(){
 const {slug}=useParams();
 const navigate=useNavigate();
 return <>
  <HomePage/>
  {slug&&<ProductModal productId={slug} onClose={()=>navigate('/',{replace:true})}/>}
 </>;
}
