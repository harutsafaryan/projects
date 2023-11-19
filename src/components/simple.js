import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';


const getPixelRatio = context => {
    var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

    return (window.devicePixelRatio || 1) / backingStore;
};


export default function Simple({schema}) {

    if (!schema)
        return null;

        let jsonData;    
        try {
            jsonData = JSON.parse(schema)    
        }
        catch(err) {
            console.log('error: ', err);
            return;
        }
    const ref = useRef();

    useEffect(() => {
        let canvas = ref.current;
        let context = canvas.getContext('2d');

        let ratio = getPixelRatio(context);
        let width = getComputedStyle(canvas)
            .getPropertyValue('width')
            .slice(0, -2);
        let height = getComputedStyle(canvas)
            .getPropertyValue('height')
            .slice(0, -2);

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;


        console.log('ratio: ', ratio);

        context.save()
        context.translate(10, 10);
        context.scale(2, 2);
        context.strokeRect(0, 0, jsonData.size.width, jsonData.size.height);
        context.strokeRect(jsonData.sash[0].x+5, jsonData.sash[0].y+5, jsonData.sash[0].width-10, jsonData.sash[0].height-10);

        context.beginPath();
        context.moveTo(jsonData.impost[0].x1, jsonData.impost[0].y1);
        context.lineTo(jsonData.impost[0].x2, jsonData.impost[0].y2);

        
        context.moveTo(jsonData.impost[1].x1, jsonData.impost[1].y1);
        context.lineTo(jsonData.impost[1].x2, jsonData.impost[1].y2);
        context.stroke();
        context.restore();

    });

    return (
        <canvas ref={ref} style={{ width: '200px', height: '150px' }} />
    )
}

Simple.propTypes = {
    schema: PropTypes.object.isRequired
  }