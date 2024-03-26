import { BsCursor } from 'react-icons/bs';
import { BsDownload } from 'react-icons/bs';
import { BsLayers } from 'react-icons/bs';


export function ToolBar({toolActive, setToolActive, setExportData, exportData, layers, setLayer, activeLayer, setActiveLayer}) {

    const handleToolState = () => {
      return setToolActive((oldValue) => !oldValue);
    }

    function exportCanvasImg() {
        setExportData(() => true)
    }

    function handleLayerChange(event) {
        event.preventDefault();

        const availableLayers = layers;
        const numLayer = layers.layerSheets.length;
        const active = layers.active;

        if(active < numLayer - 1){
            availableLayers.active = active + 1;

            setLayer(() => availableLayers);
            setToolActive(() => false);
            return setActiveLayer((oldValue)=> oldValue + 1);

        }else{
            availableLayers.active = 0;

            setLayer(() => availableLayers);
            setToolActive(() => false);
            return setActiveLayer((oldValue)=> oldValue + 1)
        }
    }
    

    return(
        
        <>  
            <div className="tool-bar">
                <button type="button" onClick={handleToolState} style={{backgroundColor : !toolActive  ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)' }}> <BsCursor  color={  !toolActive ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)' } /> </button>
                <button type="button" onClick={exportCanvasImg} style={{backgroundColor : !exportData ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)' }}><BsDownload color={ !exportData ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)' } /></button>
                <button type="button" onClick={event => handleLayerChange(event)} style={{backgroundColor : true ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)' }}><BsLayers color={  true ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)' }/> </button>
            </div>
        </>
    )
}