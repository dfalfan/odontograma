import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  toothNames,
  partTranslations,
  dentalConditions,
} from "../utils/odontoConstants";


const ToothPart = ({ d, fill, onClick }) => (
  <motion.path
    d={d}
    fill={fill}
    stroke="black"
    strokeWidth="0.5"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  />
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

  const renderToothPart = (part, d) => {
    const textPosition = {
      top: polarToCartesian(
        center,
        center,
        (outerRadius + innerRadius) / 2,
        90
      ),
      bottom: polarToCartesian(
        center,
        center,
        (outerRadius + innerRadius) / 2,
        270
      ),
      left: polarToCartesian(
        center,
        center,
        (outerRadius + innerRadius) / 2,
        180
      ),
      right: polarToCartesian(
        center,
        center,
        (outerRadius + innerRadius) / 2,
        0
      ),
      center: { x: center, y: center },
    };

    return (
      <g key={part}>
        <ToothPart
          d={d}
          fill={parts[part].color}
          onClick={() => onClick(number, part)}
        />
        {parts[part].code && (
          <text
            x={textPosition[part].x}
            y={textPosition[part].y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={parts[part].color === "white" ? "black" : "white"}
            fontSize="6"
            pointerEvents="none" // Hace que el texto no sea interactivo
            style={{ userSelect: "none" }} // Previene la selección del texto
          >
            {parts[part].code}
          </text>
        )}
      </g>
    );
  };

  return (
    <g>
      {renderToothPart("top", createSection(45, 135))}
      {renderToothPart("left", createSection(135, 225))}
      {renderToothPart("bottom", createSection(225, 315))}
      {renderToothPart("right", createSection(315, 45))}
      {renderToothPart(
        "center",
        `M${
          center - innerRadius
        },${center} a${innerRadius},${innerRadius} 0 1,0 ${
          innerRadius * 2
        },0 a${innerRadius},${innerRadius} 0 1,0 -${innerRadius * 2},0`
      )}
      <text
        x={center}
        y={size + 10}
        textAnchor="middle"
        fontSize="8"
        pointerEvents="none"
        style={{ userSelect: "none" }}
      >
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


function initializeTeethState(initialData = {}) {
  const initialTeethState = Object.fromEntries(
    [...Array(89).keys()].map((n) => [
      n,
      {
        top: { color: "white", code: "" },
        left: { color: "white", code: "" },
        bottom: { color: "white", code: "" },
        right: { color: "white", code: "" },
        center: { color: "white", code: "" },
      },
    ])
  );

  // Combinar los datos iniciales con el estado inicial
  Object.entries(initialData).forEach(([tooth, parts]) => {
    Object.entries(parts).forEach(([part, code]) => {
      const condition = dentalConditions.find((c) => c.code === code);
      if (condition) {
        initialTeethState[tooth][part] = {
          color: condition.color,
          code: condition.code,
        };
      }
    });
  });

  return initialTeethState;
}


function Odontodiagrama({ onChange, initialData = {} }) {
  const [teethState, setTeethState] = useState(() =>
    initializeTeethState(initialData)
  );
  const [currentCondition, setCurrentCondition] = useState(dentalConditions[0]);
  const [odontodiagramaSimplificado, setOdontodiagramaSimplificado] =
    useState(initialData);

  useEffect(() => {
    console.log("Datos iniciales del odontograma:", initialData);
    setTeethState(initializeTeethState(initialData));
    setOdontodiagramaSimplificado(initialData);
  }, [initialData]);

  const handleToothClick = (number, part) => {
    setTeethState((prevState) => {
      const newState = { ...prevState[number][part] };

      if (
        newState.color === currentCondition.color &&
        newState.code === currentCondition.code
      ) {
        // Deseleccionar
        newState.color = "white";
        newState.code = "";
      } else {
        // Seleccionar nueva condición
        newState.color = currentCondition.color;
        newState.code = currentCondition.code;
      }

      const updatedState = {
        ...prevState,
        [number]: {
          ...prevState[number],
          [part]: newState,
        },
      };

      // Actualizar odontodiagramaSimplificado
      setOdontodiagramaSimplificado((prevOdonto) => {
        const newOdonto = { ...prevOdonto };
        if (newState.code) {
          if (!newOdonto[number]) newOdonto[number] = {};
          newOdonto[number][part] = newState.code;
        } else {
          if (newOdonto[number]) {
            delete newOdonto[number][part];
            if (Object.keys(newOdonto[number]).length === 0) {
              delete newOdonto[number];
            }
          }
        }

        // Llamar a onChange después de actualizar el estado
        setTimeout(() => onChange(updatedState, newOdonto), 0);

        return newOdonto;
      });

      return updatedState;
    });
  };

  // Función para generar el resumen activo
  const generateActiveSummary = () => {
    const summary = [];
    Object.entries(odontodiagramaSimplificado).forEach(([number, parts]) => {
      Object.entries(parts).forEach(([part, code]) => {
        const condition = dentalConditions.find((c) => c.code === code);
        const toothName = toothNames[number] || `Diente ${number}`;
        summary.push(
          `${toothName} (${number}) superficie ${partTranslations[part]} ${condition.name}`
        );
      });
    });
    return summary;
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
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-blue-900 mb-4">Odontodiagrama</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {dentalConditions.map((condition) => (
          <motion.button
            key={condition.code}
            onClick={() => setCurrentCondition(condition)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              currentCondition.code === condition.code
                ? `bg-${condition.color}-600 text-white`
                : `bg-${condition.color}-100 text-${condition.color}-600 hover:bg-${condition.color}-200`
            }`}
          >
            {condition.name}
          </motion.button>
        ))}
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <svg width="100%" height="auto" viewBox="0 0 600 300">
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
      </div>
      <div className="mt-4">
        <h4 className="text-md font-medium text-blue-900 mb-2">
          Resumen de Condiciones Actuales:
        </h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 max-h-40 overflow-y-auto">
          {generateActiveSummary().map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Odontodiagrama;