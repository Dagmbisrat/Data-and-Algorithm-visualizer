import { useRef, useEffect, useState } from "react";
import "./StacksAnimation.css";
import PropTypes from "prop-types";

const StacksAnimations = ({
  speed,
  height,
  Push,
  Pop,
  Clear,
  Input,
  menuWidth,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [stack, setStack] = useState([]);
  const boxWidth = 50;
  const boxHeight = 50;
  const boxesPerRow = 10;
  const gap = 5;
  const textOffsetX = 20;
  const textOffsetY = 70;
  const dataOffsetX = 20;
  const dataOffsetY = 30;

  class Obj {
    constructor(position) {
      this.postion = position;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.postion.x, this.postion.y, 50, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      context.stroke();
    }

    moveDown(num) {
      this.postion.y = this.postion.y + num;
    }
    moveRight(num) {
      this.postion.x = this.postion.x + num;
    }
  }

  //pushes an element to the stack
  const pushElement = (element) => {
    if (stack.length >= 20) {
      console.error("Stack overflow: Max 20");
      return;
    }
    setStack([...stack, element]);
  };

  //pop's the stack
  const popElement = () => {
    if (stack.length === 0) {
      console.log("Stack is empty!");
      return false;
    }

    const newStack = stack.slice(0, -1);
    setStack(newStack);
    return true;
  };

  //clears the stack
  const clearStack = () => {
    setStack([]);
  };

  // chages the windowWidth when window width changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      console.log("resized");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Draw the empty array
  const drawArray = (canvas, context) => {
    const startX = canvas.width / 2 - 273; // make the array in the middle of the canvas
    const startY = canvas.height / 2 - 65;

    for (let i = 0; i < 20; i++) {
      const x = startX + (i % boxesPerRow) * (boxWidth + gap);
      const y = startY + Math.floor(i / boxesPerRow) * (boxHeight + gap + 30);

      // Draw the box
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(x, y, boxWidth, boxHeight);

      // Draw the index number
      context.fillStyle = "white";
      context.font = "16px Arial";
      context.fillText(i, x + textOffsetX, y + textOffsetY);

      //draw whats in the stack
      context.fillStyle = "white";
      context.font = "12px Arial";
      if (stack[i] == null) {
        context.fillText("", x + dataOffsetX, y + dataOffsetY);
      } else {
        context.fillText(stack[i], x + dataOffsetX, y + dataOffsetY);
      }
    }
  };
  const drawTopBox = (canvas, context) => {
    const startx = canvas.width / 2 - 273;
    const starty = canvas.height / 2 - 200;

    // Draw the box
    context.strokeStyle = "white"; // Use the boxColor prop
    context.strokeRect(startx, starty, boxWidth, boxHeight);

    // Draw the index number
    context.fillStyle = "white";
    context.font = "16px Arial";

    context.fillText("Top", startx + 13, starty + textOffsetY);

    // Draw the index number
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.fillText(stack.length, startx + dataOffsetX, starty + dataOffsetY);
  };
  //when Push is pressed
  useEffect(() => {
    if (isMounted.current) {
      Input == "" ? console.log("Input empty") : pushElement(Input);
    }
  }, [Push]);

  // when Pop is clicked
  useEffect(() => {
    if (isMounted.current) {
      popElement();
    }
  }, [Pop]);

  // when Clear is clicked
  useEffect(() => {
    if (isMounted.current) {
      clearStack();
    }
  }, [Clear]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  //handles the resize of the cavas when there is a change in the height
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (canvas) {
      canvas.height = height - 3;
      canvas.width = windowWidth - menuWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawArray(canvas, context);
      drawTopBox(canvas, context);
    }
  }, [height, windowWidth, menuWidth, stack]);
  return <canvas className="StacksAnimationCanvas" ref={canvasRef} />;
};
export default StacksAnimations;
StacksAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
