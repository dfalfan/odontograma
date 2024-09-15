import React, { useState } from "react";

const ToothPart = ({ d, fill, onClick }) => (
  <path d={d} fill={fill} stroke="black" strokeWidth="0.5" onClick={onClick} />
);

const Tooth = ({ number, parts, onClick }) => {
  const size = 30;
  const center = size / 2;
  const outerRadius = size / 2 - 1;
  const innerRadius = size / 6;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createSection = (startAngle, endAngle) => {
    const start = polarToCartesian(center, center, outerRadius, endAngle);
    const end = polarToCartesian(center, center, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const innerStart = polarToCartesian(center, center, innerRadius, endAngle);
    const innerEnd = polarToCartesian(center, center, innerRadius, startAngle);

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ");
  };

  return (
    <g>
      <ToothPart
        d={createSection(45, 135)}
        fill={parts.top}
        onClick={() => onClick(number, "top")}
      />
      <ToothPart
        d={createSection(135, 225)}
        fill={parts.left}
        onClick={() => onClick(number, "left")}
      />
      <ToothPart
        d={createSection(225, 315)}
        fill={parts.bottom}
        onClick={() => onClick(number, "bottom")}
      />
      <ToothPart
        d={createSection(315, 45)}
        fill={parts.right}
        onClick={() => onClick(number, "right")}
      />
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill={parts.center}
        stroke="black"
        strokeWidth="0.5"
        onClick={() => onClick(number, "center")}
      />
      <text x={center} y={size + 10} textAnchor="middle" fontSize="8">
        {number}
      </text>
    </g>
  );
};

const TeethRow = ({
  numbers,
  y,
  teethState,
  onToothClick,
  alignRight = false,
}) => {
  const xOffset = alignRight ? 32 * (8 - numbers.length) : 0;
  return numbers.map((number, index) => (
    <g key={number} transform={`translate(${xOffset + index * 32}, ${y})`}>
      <Tooth
        number={number}
        parts={teethState[number]}
        onClick={onToothClick}
      />
    </g>
  ));
};

const TeethColumn = ({ adult, child, x, teethState, onToothClick }) => {
  return (
    <g transform={`translate(${x}, 0)`}>
      <TeethRow
        numbers={adult.top}
        y={0}
        teethState={teethState}
        onToothClick={onToothClick}
      />
      <TeethRow
        numbers={child.top}
        y={70}
        teethState={teethState}
        onToothClick={onToothClick}
        alignRight={x === 0}
      />
      <TeethRow
        numbers={child.bottom}
        y={140}
        teethState={teethState}
        onToothClick={onToothClick}
        alignRight={x === 0}
      />
      <TeethRow
        numbers={adult.bottom}
        y={210}
        teethState={teethState}
        onToothClick={onToothClick}
      />
    </g>
  );
};

export default function Odontodiagrama() {
  const initialTeethState = Object.fromEntries(
    [...Array(89).keys()].map((n) => [
      n,
      {
        top: "white",
        left: "white",
        bottom: "white",
        right: "white",
        center: "white",
      },
    ])
  );

  const [teethState, setTeethState] = useState(initialTeethState);
  const [currentColor, setCurrentColor] = useState("red");
  const [actionLog, setActionLog] = useState([]);

  const handleToothClick = (number, part) => {
    setTeethState((prevState) => {
      const newColor =
        prevState[number][part] === currentColor ? "white" : currentColor;

      // Agregar entrada al registro
      const action = `Diente ${number} superficie ${translatePart(part)} ${
        newColor === "white" ? "deseleccionado" : newColor
      }`;
      setActionLog((prevLog) => [...prevLog, action]);

      return {
        ...prevState,
        [number]: {
          ...prevState[number],
          [part]: newColor,
        },
      };
    });
  };

  const translatePart = (part) => {
    const translations = {
      top: "oclusal/incisal",
      bottom: "oclusal/incisal",
      left: "vestibular",
      right: "palatino/lingual",
      center: "centro",
    };
    return translations[part] || part;
  };

  const leftColumn = {
    adult: {
      top: [18, 17, 16, 15, 14, 13, 12, 11],
      bottom: [48, 47, 46, 45, 44, 43, 42, 41],
    },
    child: { top: [55, 54, 53, 52, 51], bottom: [85, 84, 83, 82, 81] },
  };

  const rightColumn = {
    adult: {
      top: [21, 22, 23, 24, 25, 26, 27, 28],
      bottom: [31, 32, 33, 34, 35, 36, 37, 38],
    },
    child: { top: [61, 62, 63, 64, 65], bottom: [71, 72, 73, 74, 75] },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Odontodiagrama</h3>
      <div className="mb-4">
        <button
          onClick={() => setCurrentColor("red")}
          className={`px-4 py-2 mr-2 rounded ${
            currentColor === "red" ? "bg-red-500 text-white" : "bg-red-200"
          }`}
        >
          Rojo
        </button>
        <button
          onClick={() => setCurrentColor("blue")}
          className={`px-4 py-2 mr-2 rounded ${
            currentColor === "blue" ? "bg-blue-500 text-white" : "bg-blue-200"
          }`}
        >
          Azul
        </button>
      </div>
      <svg width="600" height="300" viewBox="0 0 600 300">
        <TeethColumn
          {...leftColumn}
          x={0}
          teethState={teethState}
          onToothClick={handleToothClick}
        />
        <TeethColumn
          {...rightColumn}
          x={300}
          teethState={teethState}
          onToothClick={handleToothClick}
        />
      </svg>
      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-900 mb-2">
          Registro de Acciones:
        </h4>
        <ul className="list-disc pl-5">
          {actionLog.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
