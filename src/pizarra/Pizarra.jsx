import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";
import { db } from "../firebase-confing/Firebase";
import { collection, addDoc, getDocs, doc, setDoc  } from "firebase/firestore";

export default function Pizarra() {
  const stageRef = useRef();
  const transformerRef = useRef();
  const isPaining = useRef(false);
  const currentShapeId = useRef();

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#ff0000");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const strokeColor = "#000";
  const isDraggable = action === ACTIONS.SELECT;

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function guardarDibujo() {
    setLoading(true);
    setSaveStatus(null);
    try {
      const docRef = await addDoc(collection(db, "pizarra"), {
        rectangulos: rectangles,
        circulos: circles,
        flechas: arrows,
        garabatos: scribbles,
        timestamp: new Date(),
      });
      console.log("Dibujo guardado con ID: ", docRef.id);
      setSaveStatus({ success: true, message: "Dibujo guardado correctamente" });
      
      // Guardar también en localStorage
      const dibujo = {
        rectangulos: rectangles,
        circulos: circles,
        flechas: arrows,
        garabatos: scribbles,
        firebaseId: docRef.id,
      };
      localStorage.setItem("pizarraDibujo", JSON.stringify(dibujo));
    } catch (e) {
      console.error("Error al guardar el dibujo: ", e);
      setSaveStatus({ success: false, message: "Error al guardar el dibujo" });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  }

  async function cargarDibujos() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "pizarra"));
      
      // Ordenar por timestamp para obtener el más reciente
      const sortedDocs = querySnapshot.docs.sort((a, b) => {
        const aTime = a.data().timestamp?.toMillis() || 0;
        const bTime = b.data().timestamp?.toMillis() || 0;
        return bTime - aTime;
      });

      if (sortedDocs.length > 0) {
        const data = sortedDocs[0].data();
        
        // Validar y cargar los datos
        setRectangles(Array.isArray(data.rectangulos) ? data.rectangulos : []);
        setCircles(Array.isArray(data.circulos) ? data.circulos : []);
        setArrows(Array.isArray(data.flechas) ? data.flechas : []);
        setScribbles(Array.isArray(data.garabatos) ? data.garabatos : []);

        // Guardar en localStorage
        const dibujo = {
          rectangulos: Array.isArray(data.rectangulos) ? data.rectangulos : [],
          circulos: Array.isArray(data.circulos) ? data.circulos : [],
          flechas: Array.isArray(data.flechas) ? data.flechas : [],
          garabatos: Array.isArray(data.garabatos) ? data.garabatos : [],
          firebaseId: sortedDocs[0].id,
        };
        localStorage.setItem("pizarraDibujo", JSON.stringify(dibujo));
        
        console.log("Dibujo cargado correctamente");
      } else {
        console.log("No hay dibujos guardados en Firebase");
      }
    } catch (error) {
      console.error("Error al cargar dibujos:", error);
    } finally {
      setLoading(false);
    }
  }

  function limpiarPizarra() {
    setRectangles([]);
    setCircles([]);
    setArrows([]);
    setScribbles([]);
    localStorage.removeItem("pizarraDibujo");
  }

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPaining.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles([...rectangles, { id, x, y, height: 20, width: 20, fillColor }]);
        break;
      case ACTIONS.CIRCLE:
        setCircles([...circles, { id, x, y, radius: 20, fillColor }]);
        break;
      case ACTIONS.ARROW:
        setArrows([...arrows, { id, points: [x, y, x + 20, y + 20], fillColor }]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles([...scribbles, { id, points: [x, y], fillColor }]);
        break;
    }
  }

  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPaining.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((r) =>
            r.id === currentShapeId.current
              ? { ...r, width: x - r.x, height: y - r.y }
              : r
          )
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((c) =>
            c.id === currentShapeId.current
              ? { ...c, radius: Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2) }
              : c
          )
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((a) =>
            a.id === currentShapeId.current
              ? { ...a, points: [a.points[0], a.points[1], x, y] }
              : a
          )
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((s) =>
            s.id === currentShapeId.current
              ? { ...s, points: [...s.points, x, y] }
              : s
          )
        );
        break;
    }
  }

  function onPointerUp() {
    isPaining.current = false;
  }

  function handleExport() {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  // Auto-guardado en localStorage
  useEffect(() => {
    const dibujo = {
      rectangulos: rectangles,
      circulos: circles,
      flechas: arrows,
      garabatos: scribbles,
    };
    localStorage.setItem("pizarraDibujo", JSON.stringify(dibujo));
  }, [rectangles, circles, arrows, scribbles]);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const dibujoGuardado = localStorage.getItem("pizarraDibujo");
    if (dibujoGuardado) {
      const data = JSON.parse(dibujoGuardado);
      setRectangles(data.rectangulos || []);
      setCircles(data.circulos || []);
      setArrows(data.flechas || []);
      setScribbles(data.garabatos || []);
    } else {
      cargarDibujos(); // si no hay nada en localStorage, intenta desde Firebase
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Controles */}
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg bg-white">
          <button
            className={action === ACTIONS.SELECT ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}
            onClick={() => setAction(ACTIONS.SELECT)}
          >
            <GiArrowCursor size="2rem" />
          </button>
          <button
            className={action === ACTIONS.RECTANGLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}
            onClick={() => setAction(ACTIONS.RECTANGLE)}
          >
            <TbRectangle size="2rem" />
          </button>
          <button
            className={action === ACTIONS.CIRCLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}
            onClick={() => setAction(ACTIONS.CIRCLE)}
          >
            <FaRegCircle size="1.5rem" />
          </button>
          <button
            className={action === ACTIONS.ARROW ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}
            onClick={() => setAction(ACTIONS.ARROW)}
          >
            <FaLongArrowAltRight size="2rem" />
          </button>
          <button
            className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}
            onClick={() => setAction(ACTIONS.SCRIBBLE)}
          >
            <LuPencil size="1.5rem" />
          </button>
          <input
            className="w-6 h-6 cursor-pointer"
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
          <button onClick={handleExport}>
            <IoMdDownload size="1.5rem" />
          </button>
          <button 
            className="text-sm px-2 py-1 bg-green-200 rounded hover:bg-green-300 disabled:bg-gray-200"
            onClick={guardarDibujo}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button 
            className="text-sm px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 disabled:bg-gray-200"
            onClick={cargarDibujos}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar"}
          </button>
          <button 
            className="text-sm px-2 py-1 bg-red-200 rounded hover:bg-red-300"
            onClick={limpiarPizarra}
          >
            Limpiar
          </button>
        </div>
        {/* Mensaje de estado */}
        {saveStatus && (
          <div className={`mt-2 text-center text-sm px-4 py-2 rounded mx-auto w-fit ${
            saveStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {saveStatus.message}
          </div>
        )}
      </div>

      {/* Lienzo */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={stageSize.width}
            height={stageSize.height}
            fill="#ffffff"
            id="bg"
            onClick={() => transformerRef.current.nodes([])}
          />

          {rectangles.map((r) => (
            <Rect
              key={r.id}
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              fill={r.fillColor}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}

          {circles.map((c) => (
            <Circle
              key={c.id}
              x={c.x}
              y={c.y}
              radius={c.radius}
              fill={c.fillColor}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}

          {arrows.map((a) => (
            <Arrow
              key={a.id}
              points={a.points}
              fill={a.fillColor}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}

          {scribbles.map((s) => (
            <Line
              key={s.id}
              points={s.points}
              fill={s.fillColor}
              stroke={strokeColor}
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}

          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      {/* Overlay de carga */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Cargando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
