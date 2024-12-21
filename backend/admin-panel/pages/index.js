import { useEffect, useState } from "react";

export default function Home(){
  const [title, setTitle] = useState("Beranda");
  useEffect(()=>{
    //setTitle("Utamaaa")
  },[])
  return(
    <div>Ini adalah halaman {title}</div>
  )
}