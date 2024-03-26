import { Canvas } from "./canvas/canvas";
import { useState, useEffect } from "react";
import { ImgInput } from "./imginput";
import { ToolBar } from "./toolbar";
import './App.css';

export function App() {

  //========== states ========
  const [img, setImg] = useState(null);
  const [toolActive, setToolActive] = useState(false);
  const [exportData, setExportData] = useState(false);
  const [layers, setLayer] = useState({active : 0, layerSheets : [] })
  const [imgUploaded, setImgUploaded ] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);

  

  useEffect(()=>{
    if(img !== null){
      setImgUploaded(() => true);
    }
  },[img]);

  useEffect(()=>{
    document.addEventListener('keydown', (event)=>{
        event.preventDefault();
        event.stopPropagation();


        if(event.key === 'm'){
          return setToolActive((oldValue) => !oldValue);
        }
        
    }); 


    return()=>{
      document.removeEventListener('keypress', (event)=>{
          event.preventDefault();
          event.stopPropagation();
          
          if(event.key === 'm'){
            return setToolActive((oldValue) => !oldValue);
          }
      }); 
    }
  },[])

  return(
    <>
      { 

        (
          imgUploaded &&
          <>
            <ToolBar  toolActive={toolActive} setToolActive={setToolActive} exportData={exportData} setExportData={setExportData} layers={layers} setLayer={setLayer} activeLayer ={activeLayer} setActiveLayer={setActiveLayer} />
            <Canvas img={img}  toolState={toolActive} exportData={exportData} setExportData={setExportData}  layers={layers} setLayer={setLayer} />
          </>
        )
      }
      {
        img === null &&
        (< ImgInput img={img} setImg={setImg} />)
      }
    </>
    
  )
}