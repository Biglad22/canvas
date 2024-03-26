import { useEffect, useRef, useState } from "react";
import './style.css';

export const Canvas = ({toolState, img, setExportData, exportData, layers, setLayer}) =>{

    const ref = useRef(null);

    ///=======================selection tool states

    const startX = useRef(null);
    const startY = useRef(null);
    const boxPoints = useRef({tl:0, tm:0, tr: 0, ml:0, mr:0, bl:0, bm:0, br: 0});
    const offsetX = useRef(null);
    const offsetY = useRef(null);
    const canvasData = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const currentBox = useRef(null);
    
    useEffect(()=>{
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');

        if(canvasData.current){ ctx.putImageData(canvasData.current, 0, 0)}

    },[])

    //======= use effect for image upload 
    useEffect(()=>{
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');

    

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleSizing = () =>{

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            
            if(canvasData.current){ 

                const x = (canvas.width - canvasData.current.width) / 2;
                const y = (canvas.height - canvasData.current.height) / 2;

                ctx.putImageData(canvasData.current, x, y)
            }; 
        }

    
        ///================= event listeners =============
        //======= resizing
        window.addEventListener('resize', handleSizing());



        //================== playground ================
        const canvasOffSet = canvas.getBoundingClientRect();
        offsetX.current = canvasOffSet.left;
        offsetY.current = canvasOffSet.top;

        //======== create img 
        (()=>{if(img !== null) {
            const image = new Image();
            image.src = img;
            image.style.objectFit = 'contain';

            image.onload = () =>{
                drawImg(ctx, image, 0, 0, canvas.width, canvas.height);
            }

        }else{
            //do nothing
        }})();


        //////========== functions ===========
        
        //========= image function 
        function drawImg(ctx, img, x, y, width, height) {

            const scale = Math.min((width / img.width) / 1.25 , ((height / img.height) / 1.25)  );
            const scaleWidth = img.width * scale;
            const scaleHeight = img.height * scale;

            const offsetX = (width - scaleWidth) / 2;
            const offsetY = (height - scaleHeight) / 2;

            //clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, x + offsetX, y + offsetY, scaleWidth, scaleHeight);
            
        }

    
        ///remove sizing function
        return()=>{
            window.removeEventListener('resize', handleSizing);
        };
    },[img]);




    //========== box drawing functions =========
    function handleMouseDown ({nativeEvent}){
        if(toolState){ 
            

            const canvas = ref.current;
            const ctx = canvas.getContext('2d');

            //======= handle canavas clearing

            if(canvasData.current){
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const x = (canvas.width - canvasData.current.width) / 2;
                const y = (canvas.height - canvasData.current.height) / 2;

                ctx.putImageData(canvasData.current, x, y);
            }
            
            nativeEvent.preventDefault();
            nativeEvent.stopPropagation();

            //==== define selection starting poins 
            startX.current = nativeEvent.clientX - offsetX.current;
            startY.current = nativeEvent.clientY - offsetY.current;
            
            


            //===== defin first set of points for selsction tool
            boxPoints.current.tl = {x : nativeEvent.clientX - offsetX.current, y:  nativeEvent.clientY - offsetY.current};

            if(currentBox.current === null){
                canvasData.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
            };

            setIsDrawing(() => true );
        }
        else{
            //do nothing
        }
    };

    function handleMouseMove({nativeEvent}){
        if (!isDrawing) return;
        
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const newMouseX = nativeEvent.clientX - offsetX.current;
        const newMouseY = nativeEvent.clientY - offsetY.current;

        //======== selection sizing
        const rectWidth = newMouseX - startX.current;
        const rectHeight = newMouseY - startY.current;


        //============ seletion points 

        const endX = newMouseX;
        const endY = newMouseY;

        const midX = endX - ( rectWidth / 2 );
        const midY = endY - ( rectHeight / 2 ) ;

        //top points
        boxPoints.current.tm = {x : midX, y: startY.current};
        boxPoints.current.tr = {x : endX, y: startY.current};

        ///middle points
        boxPoints.current.ml = {x : startX.current, y: midY};
        boxPoints.current.mr = {x : endX, y: midY};

        ///bottom points
        boxPoints.current.bl = {x : startX.current, y: endY};
        boxPoints.current.bm = {x : midX, y: endY};
        boxPoints.current.br = {x : endX, y: endY};

        //======= handle canavas clearing
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const x = (canvas.width - canvasData.current.width) / 2;
        const y = (canvas.height - canvasData.current.height) / 2;
        ctx.putImageData(canvasData.current, x, y);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.setLineDash([6]);
        ctx.lineWidth = 2;
        ctx.strokeRect(startX.current, startY.current, rectWidth, rectHeight);

        //======= draw poiints

        ctx.fillStyle = 'rgba(0, 0, 0, 0.86)';
        ctx.fillRect(boxPoints.current.tl.x - 5, boxPoints.current.tl.y - 5, 10, 10);
        ctx.fillRect(boxPoints.current.tm.x - 5, boxPoints.current.tm.y - 5, 10, 10);
        ctx.fillRect(boxPoints.current.tr.x - 5, boxPoints.current.tr.y - 5, 10, 10);

        ctx.fillRect(boxPoints.current.ml.x - 5, boxPoints.current.ml.y - 5, 10, 10);
        ctx.fillRect(boxPoints.current.mr.x - 5, boxPoints.current.mr.y - 5, 10, 10);

        ctx.fillRect(boxPoints.current.bl.x - 5, boxPoints.current.bl.y - 5, 10, 10);
        ctx.fillRect(boxPoints.current.bm.x - 5, boxPoints.current.bm.y - 5, 10, 10);
        ctx.fillRect(boxPoints.current.br.x - 5, boxPoints.current.br.y - 5, 10, 10);


        //===== current but coordinates
        currentBox.current = {
            x : startX.current,
            y : startY.current,
            width : rectWidth,
            height : rectHeight,
            points : {
                        tl:boxPoints.current.tl, 
                        tm:boxPoints.current.tm, 
                        tr:boxPoints.current.tr, 
                        ml:boxPoints.current.ml, 
                        mr:boxPoints.current.mr, 
                        bl:boxPoints.current.bl, 
                        bm:boxPoints.current.bm, 
                        br:boxPoints.current.br
                    }
        }
    }

    function handleMouseUp(){
        return setIsDrawing(()=> false);
    }



    //===================== use effect for canvas exportation
    useEffect(()=>{

        if(exportData === true){

            const canvas = ref.current;

            // Get the base64 encoded image data
            var imageData = canvas.toDataURL("image/jpeg");

            // Create a link element
            var link = document.createElement('a');
            link.download = 'canvasProject.jpg'; // Set the filename
            link.href = imageData; // Set the data URI as href

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up
            document.body.removeChild(link);
            setExportData(() => false)
        }else{
            //do nothing
        }    
    },[exportData]);


    

    // ========================= logic for layers collection
    useEffect(()=>{
        let activeLayer = layers.active;

        const newState =  layers; 
        
        
        if(newState.layerSheets.length > 0){ 

            newState.layerSheets.forEach(elem => {
                if (elem === activeLayer){
                    elem.data = canvasData.current;
                }
                console.log(newState);
            });
            setLayer(()=> newState);
         
        }else{
            newState.layerSheets.push({layer: activeLayer, data : canvasData.current });

            return setLayer(()=> activeLayer);
        }
    }, [canvasData.current]);

    //================== use effect for layer change ======
    useEffect(()=>{


        if(layers.layerSheets.length > 0 ){
            const canvas = ref.current;
            const ctx = canvas.getContext('2d');

            const active = layers.active ;

            console.log(active);

            layers.layerSheets.forEach(elem =>{

                if(elem.layer === active && elem.data !== null ){
                    const x = (canvas.width - elem.data.width) / 2;
                    const y = (canvas.height - elem.data.height) / 2;


                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.putImageData(elem.data, x, y);
                    canvasData.current = elem.data;
                }
            })
        }

    },[layers.active])
    
    //=============== use effect for keyshortcuts =======
    useEffect(()=>{
        //================ Add event listener for keydown
        document.addEventListener('keydown', (event)=>{
            return shortCuts(event);
        })

        function shortCuts(event){
            const canvas = ref.current;
            const ctx = canvas.getContext('2d');
        
            event.preventDefault();
            event.stopPropagation();

            if (event.key === 'Delete' && currentBox.current !== null) {

                let x = currentBox.current.x;
                let y = currentBox.current.y;
                let width = currentBox.current.width;
                let height = currentBox.current.height;

                ctx.clearRect(x - 7, y - 7 , width + 14 , height + 14);
                canvasData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

            }else if( event.key === 'm' && event.ctrlKey && currentBox.current !== null){

                let x =currentBox.current.x;
                let y =currentBox.current.y;
                let width =currentBox.current.width;
                let height =currentBox.current.height;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.putImageData(canvasData.current, 0, 0);

                const duplicate = ctx.getImageData(x - 2, y - 2 , width + 4 , height + 4);

                (()=>{
                    const oldLayers = layers;

                    let newLayer = oldLayers.layerSheets.length;

                    oldLayers.layerSheets.push({layer : newLayer, data : duplicate});
                    return setLayer(() => oldLayers);
                })()

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.putImageData(canvasData.current, 0, 0);
            }
        };

        return()=>{
            document.removeEventListener('keydown', (event)=>{
                return shortCuts(event);
            })
        }
    },[canvasData])



    return(
        <>
            <canvas 
                ref={ref} 
                className="full-screen-canvas"  
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            
        </>
    )
}
