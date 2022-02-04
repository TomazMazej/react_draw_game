import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";

const Canvas = ({socket}) => {
    const [isDrawing, setIsDrawing] = useState(false)
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        // Nastavitve canvasa
        const canvas = canvasRef.current;
        canvas.width = 800 ;
        canvas.height = 800;
        canvas.style.width = `800px`;
        canvas.style.height = `800px`;

        const context = canvas.getContext("2d")
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;

        // Sprejmemo poslan canvas
		socket.on("canvas-data", (data) => {
                if(isDrawing) return;
                var image = new Image();
                image.onload = function() {
                    context.drawImage(image, 0, 0);
                    setIsDrawing(false);
                };
                image.src = data;
			})
			return () => socket.disconnect()
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        // Poljemo canvas ostalim
        var base64ImageData = canvasRef.current.toDataURL("image/png");
        socket.emit("canvas-data", base64ImageData);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    return (
        <div>
            <canvas
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
            />
            <button onClick={clearCanvas} className={styles.black_btn}>Clear</button>
        </div>
    );
};

export default Canvas;