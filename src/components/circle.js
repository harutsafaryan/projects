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


export default function Circle({schema}) {
    const ref = useRef();

    useEffect(() => {
        let canvas = ref.current;
        let context = canvas.getContext('2d');
        console.log('schema: ', schema);

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

        context.fillStyle = "rgb(200, 0, 0)";
        context.fillRect(10, 10, schema.width, schema.height);

        context.fillStyle = "rgba(0, 0, 200, 0.5)";
        context.fillRect(10, 10, schema.width, schema.height);

        context.beginPath();
        context.moveTo(75, 50);
        context.lineTo(schema.width, 75);
        context.lineTo(100, 25);
        context.fill();
    });

    return (
        <canvas ref={ref} style={{ width: '200px', height: '100px' }} />
    )
}

Circle.propTypes = {
    schema: PropTypes.object.isRequired
  }