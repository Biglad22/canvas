import { useState } from "react";

export function ImgInput({img, setImg}) {
    const [over, setOver] = useState(false);

    const [dropMsg, setDropMsg] = useState('drag and drop image');

    //handles drag
    function handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      handleImage(file);
    }

    function handleFileInputChange(event) {
      const file = event.target.files[0];
      handleImage(file);
    }

    function handleImage(file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            let newValue = e.target.result;
            setImg(() => newValue);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    }

    function handleDragOver(event) {
      event.preventDefault();
      setDropMsg(() => 'drop image');
      setOver(()=> true);
    }

    function dragLeave() {
        setOver(()=> false);
        setDropMsg(() => 'drag and drop image');
    }

    return(
        <>
            <label htmlFor="input-file" onDragLeave={dragLeave} onDragOver={handleDragOver} onDrop={handleDrop}  className="label-input" style={{cursor : 'pointer', textTransform : 'capitalize', fontWeight : '700', fontSize : '2.4rem', width : '100%', height : '100%', textAlign : 'center', border : over ? '4px solid rgba(154,220,30, 0.3)' :  '4px solid rgba(154,220,30, 0)', color: over ? 'rgba(154,220,30, 0.86)' : 'rgba(0,0,0, 0.86)'}}>
                {dropMsg}
            </label>
            <input type="file" accept="image/*" name="input-file" id="input-file" onChange={handleFileInputChange}  style={{display : 'none'}} />
            
        </>
    )    
}