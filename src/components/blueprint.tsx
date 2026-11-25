"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { dimensions, parts, type PartId } from "@/data/car";

// Plano genérico en milímetros: x=0 es la punta de la trompa; el eje delantero está en 900 y el trasero en 4300.
const FRONT = 900, REAR = 4300, LENGTH = 5505, HALF = 950;

const button = (on: boolean) => `cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors ${on ? "border-race bg-race text-white" : "border-line text-muted hover:text-ink"}`;

const turn = (x: number, y: number, deg: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transform: `rotate(${deg}deg)` });

const both = (draw: (s: 1 | -1) => ReactNode) => ([1, -1] as const).map((s) => <g key={s}>{draw(s)}</g>);

/** Cota entre dos puntos, horizontal o vertical, con flechas y líneas de referencia. */
function Dim({ a, b, text, refs, side = 1 }: { a: [number, number]; b: [number, number]; text: string; refs: number; side?: 1 | -1 }) {
  const vertical = a[0] === b[0];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return (
    <g className="bp-dim">
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
      {[a, b].map(([x, y], i) => <line key={i} className="bp-ref" x1={x} y1={y} x2={vertical ? x + refs : x} y2={vertical ? y : y + refs} />)}
      <text x={mid[0]} y={mid[1]} dy={side === 1 ? "-0.4em" : "1.15em"} textAnchor="middle" transform={vertical ? `rotate(-90 ${mid[0]} ${mid[1]})` : undefined}>{text}</text>
    </g>
  );
}

function Wheel({ x, r }: { x: number; r: number }) {
  return (
    <g>
      <circle className="bp-solid" cx={x} cy={-r} r={r} />
      <circle cx={x} cy={-r} r={r - 25} className="bp-thin" />
      <circle cx={x} cy={-r} r={232} />
      <circle cx={x} cy={-r} r={150} className="bp-dash" />
      <circle cx={x} cy={-r} r={45} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} className="bp-thin" x1={x} y1={-r - 45} x2={x} y2={-r - 225} transform={`rotate(${i * 36} ${x} ${-r})`} />)}
    </g>
  );
}

const callouts: [PartId, [number, number], [number, number]][] = [
  ["ruedas", [760, -640], [620, -1180]],
  ["suspension", [1330, -430], [1400, -1180]],
  ["chasis", [2180, -835], [2180, -1180]],
  ["combustion", [3450, -500], [3250, -1180]],
  ["turbo", [3840, -490], [3850, -1180]],
  ["caja", [4130, -380], [4500, -1180]],
  ["aleron-trasero", [5330, -930], [5330, -1180]],
  ["aleron-delantero", [250, -70], [250, 270]],
  ["piso", [2150, -70], [2150, 270]],
  ["bateria", [2980, -190], [2880, 270]],
  ["mguk", [3400, -170], [3480, 270]],
];

const notes: [PartId, string, [number, number], [number, number]][] = [
  ["bateria", "4 MJ", [2980, -270], [2500, -1150]],
  ["combustion", "400 kW", [3500, -270], [3550, -1150]],
  ["mguk", "350 kW", [3400, 405], [3050, 1180]],
  ["caja", "8 marchas", [4350, 90], [4250, 1180]],
];

export function Blueprint() {
  const panel = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [straight, setStraight] = useState(false);
  const [dims, setDims] = useState(true);
  const part = parts.find((p) => p.id === selected);

  const pick = (id: PartId) => {
    setSelected(id);
    requestAnimationFrame(() => panel.current?.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  };
  const on = (id: PartId) => (selected === id ? " bp-on" : "");
  const g = (id: PartId, children: ReactNode, inside = false) => (
    <g className={`bp-part${inside ? " bp-inside" : ""}${on(id)}`} onClick={() => pick(id)}>{children}</g>
  );

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" aria-pressed={straight} onClick={() => setStraight(!straight)} className={button(straight)}>Modo recta</button>
        <button type="button" aria-pressed={dims} onClick={() => setDims(!dims)} className={button(dims)}>Medidas</button>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="blueprint min-w-0 rounded-md">
          <svg width="0" height="0" className="absolute" aria-hidden>
            <defs><marker id="bp-arrow" viewBox="0 0 10 6" refX="10" refY="3" markerUnits="userSpaceOnUse" markerWidth="90" markerHeight="54" orient="auto-start-reverse"><path d="M0 0 10 3 0 6z" fill="#cfe2ff" /></marker></defs>
          </svg>

          <figure>
            <figcaption>Vista lateral</figcaption>
            <svg viewBox="-450 -1400 6550 2560" role="img" aria-label="Plano lateral del monoplaza. Las piezas también se eligen con la lista de botones.">
              <line className="bp-ground" x1={-300} x2={5850} y1={0} y2={0} />
              {g("suspension", <path d="M900-400 1480-360M900-400 1380-520M900-260 1450-250M4300-420 3900-440M4300-420 4750-400" />)}
              {g("piso", <><path className="bp-fill" d="M1780-105 1900-60H4350L5000-330 4900-345 4330-130H1850z" /><path className="bp-thin" d="M4420-65 4950-310M4550-120 4960-320" /></>)}
              {g("chasis", <>
                <path className="bp-fill" d="M0-190Q-10-230 60-250C450-400 800-525 1150-580 1500-630 1750-645 1960-650L2180-632C2380-600 2600-600 2700-650L2790-850Q2800-940 2880-945C3150-950 3350-880 3700-760 4100-625 4500-500 5180-420L5200-330 4700-300 4250-190 3900-130H2050C1650-190 1300-260 900-250 550-240 250-195 0-190z" />
                <path className="bp-thin" d="M120-240C700-390 1300-520 2150-560M2900-915C3300-880 4000-650 4550-500M3350-870 4250-700 4600-480" />
                <path d="M2250-540C2320-560 2420-565 2520-555 3050-535 3600-460 4150-260L3900-150M2250-540 2220-400C2350-340 2500-200 2800-165M2250-540C2270-490 2260-440 2220-400" />
                <path d="M2790-850Q2850-840 2845-780L2760-740M2830-720 3000-560" className="bp-thin" />
                <path className="bp-thin" d="M1480-300V-620M2050-190V-620M2720-150V-640" strokeDasharray="9 4 2 4" />
                <path d="M2470-620C2440-780 2510-850 2610-850 2720-850 2750-770 2735-650M2465-735 2540-740 2545-690 2465-680" />
                <path className="bp-fill" d="M1900-652 2030-800Q2055-835 2110-838L2420-835C2570-825 2700-790 2810-730L2800-695C2680-750 2560-782 2410-790L2110-795 2000-650z" />
                <path d="M2080-650 2070-720 2230-735 2235-700z" />
              </>)}
              {g("bateria", <><rect x={2760} y={-390} width={440} height={240} rx={20} /><path className="bp-thin" d="M2850-390V-150M2940-390V-150M3030-390V-150M3120-390V-150" /></>, true)}
              {g("combustion", <><path d="M3230-200V-450L3290-600H3700L3750-450V-200z" /><circle cx={3320} cy={-480} r={42} /><circle cx={3490} cy={-480} r={42} /><circle cx={3660} cy={-480} r={42} /><path className="bp-thin" d="M3230-390H3750" /></>, true)}
              {g("mguk", <><rect x={3260} y={-245} width={300} height={130} rx={60} /><path className="bp-thin" d="M3330-245V-115M3490-245V-115" /></>, true)}
              {g("turbo", <><circle cx={3850} cy={-470} r={88} /><circle cx={3850} cy={-470} r={35} /><path d="M3850-558H3960" /></>, true)}
              {g("ruedas", <><Wheel x={FRONT} r={350} /><Wheel x={REAR} r={355} /></>)}
              {g("caja", <path d="M3780-180V-360L3950-390 4500-360 4580-300 4480-220z" />, true)}
              {g("aleron-delantero", <>
                <path className="bp-thin bp-hit" d="M20-60H540V-230L300-290 60-160z" />
                <path className="bp-fill" d="M0-75Q130-130 270-95 120-85 0-75z" />
                <path className="bp-fill bp-move" style={turn(250, -110, straight ? 14 : 0)} d="M250-110Q340-150 420-195 350-125 250-110z" />
                <path className="bp-fill bp-move" style={turn(390, -190, straight ? 24 : 0)} d="M390-190Q460-225 515-275 480-190 390-190z" />
                <path d="M130-215 110-110" />
              </>)}
              {g("aleron-trasero", <>
                <path className="bp-thin bp-hit" d="M4960-950H5505L5490-600 5300-440H5150L4960-640z" />
                <path d="M5040-425C5060-600 5120-700 5140-830M5110-425C5130-600 5170-700 5190-820" />
                <path className="bp-fill" d="M4980-800Q5130-855 5280-840 5130-790 4980-800z" />
                <path className="bp-fill bp-move" style={turn(5285, -860, straight ? 28 : 0)} d="M5285-860Q5400-870 5470-940 5410-840 5285-860z" />
              </>)}
              {dims && <>
                <Dim a={[FRONT, 690]} b={[REAR, 690]} refs={-670} text="3.400" />
                <Dim a={[0, 1010]} b={[LENGTH, 1010]} refs={-990} text="5.505" />
                <Dim a={[5820, 0]} b={[5820, -950]} refs={-300} text="950" />
              </>}
              {callouts.map(([id, [x1, y1], [x, y]]) => (
                <g key={id} className={`bp-call${on(id)}`} onClick={() => pick(id)}>
                  <line x1={x1} y1={y1} x2={x} y2={y} /><circle className="bp-dot" cx={x1} cy={y1} r={16} />
                  <circle className="bp-num" cx={x} cy={y} /><text x={x} y={y} dy="0.36em" textAnchor="middle">{parts.findIndex((p) => p.id === id) + 1}</text>
                </g>
              ))}
            </svg>
          </figure>

          <figure>
            <figcaption>Vista superior</figcaption>
            <svg viewBox="-450 -1420 6550 2840" role="img" aria-label="Plano superior del monoplaza">
              <line className="bp-axis" x1={-250} x2={5750} y1={0} y2={0} />
              {g("piso", <><path className="bp-fill" d="M1780-260 1950-720Q2000-760 2060-760H3650L3780-560H4400L4960-480V480L4400 560H3780L3650 760H2060Q2000 760 1950 720L1780 260z" /><path className="bp-thin" d="M1950-620H2700M1950 620H2700M4400-320H4960M4400 320H4960M4400-160H4960M4400 160H4960" /></>)}
              {g("suspension", both((s) => <path d={`M900 ${s * 690} 1350 ${s * 200}M900 ${s * 690} 780 ${s * 140}M960 ${s * 690} 1180 ${s * 180}M4300 ${s * 600} 4080 ${s * 130}M4300 ${s * 600} 4560 ${s * 110}M4240 ${s * 600} 3950 ${s * 150}`} />))}
              {g("aleron-delantero", both((s) => <>
                <path className="bp-fill" d={`M40 0 60 ${s * 120} 160 ${s * 880}H400L330 ${s * 180} 300 0z`} />
                <path className="bp-fill" d={`M300 ${s * 190} 390 ${s * 870}H530L440 ${s * 190}z`} />
                <path className="bp-thin" d={`M380 ${s * 190} 460 ${s * 870}`} />
                <path className="bp-fill" d={`M120 ${s * 875}H545V${s * 925}H180z`} />
              </>))}
              {g("chasis", <>
                {both((s) => <>
                  <path className="bp-fill" d={`M2250 ${s * 300} 2220 ${s * 690}Q2500 ${s * 730} 2900 ${s * 680}C3400 ${s * 600} 3600 ${s * 330} 4250 ${s * 190}L4250 0H2250z`} />
                  <path className="bp-thin" d={`M2300 ${s * 340} 2290 ${s * 640}M2650 ${s * 420}C3100 ${s * 480} 3500 ${s * 320} 3950 ${s * 200}`} />
                  <path d={`M2010 ${s * 360} 2000 ${s * 560}M1970 ${s * 560}H2040V${s * 700}H1970z`} />
                </>)}
                <path className="bp-fill" d="M0-60C300-110 700-150 1000-175 1400-210 1750-290 2100-355 2500-400 2800-380 3100-300 3700-190 4400-110 5180-60V60C4400 110 3700 190 3100 300 2800 380 2500 400 2100 355 1750 290 1400 210 1000 175 700 150 300 110 0 60Q-25 0 0-60z" />
                <path className="bp-thin" d="M150-70C800-110 1500-160 2000-240M150 70C800 110 1500 160 2000 240" />
                <path d="M2000 0C2030-160 2200-235 2450-235 2650-235 2760-200 2780-120V120C2760 200 2650 235 2450 235 2200 235 2030 160 2000 0z" />
                <ellipse cx={2600} cy={0} rx={140} ry={120} /><path d="M2478-70Q2455 0 2478 70M2180-130H2240V130H2180z" />
                <path className="bp-fill" d="M1900-28H2030C2070-190 2250-265 2450-265 2650-265 2760-240 2830-200L2810-160C2740-195 2650-215 2450-215 2260-215 2110-150 2095 0 2110 150 2260 215 2450 215 2650 215 2740 195 2810 160L2830 200C2760 240 2650 265 2450 265 2250 265 2070 190 2030 28H1900z" />
                <path d="M2800-105Q2870-130 2900-60V60Q2870 130 2800 105zM2900-8H4550M2900 8H4550" />
              </>)}
              {g("bateria", <><rect x={2760} y={-270} width={440} height={540} rx={20} /><path className="bp-thin" d="M2760-135H3200M2760 0H3200M2760 135H3200" /></>, true)}
              {g("combustion", <><rect x={3230} y={-270} width={520} height={540} rx={20} />{both((s) => [3320, 3490, 3660].map((x) => <circle key={x} cx={x} cy={s * 170} r={55} />))}<path className="bp-thin" d="M3230-70H3750M3230 70H3750" /></>, true)}
              {g("mguk", <rect x={3260} y={275} width={300} height={130} rx={60} />, true)}
              {g("turbo", <><circle cx={3850} cy={0} r={88} /><circle cx={3850} cy={0} r={35} /></>, true)}
              {g("caja", <path d="M3950-130 4500-90 4580-50V50L4500 90 3950 130z" />, true)}
              {g("ruedas", both((s) => <>
                <rect className="bp-solid" x={550} y={s === 1 ? HALF - 280 : -HALF} width={700} height={280} rx={60} /><path className="bp-thin" d={`M610 ${s * 720}H1190M610 ${s * 900}H1190`} />
                <rect className="bp-solid" x={3945} y={s === 1 ? HALF - 375 : -HALF} width={710} height={375} rx={70} /><path className="bp-thin" d={`M4015 ${s * 635}H4585M4015 ${s * 890}H4585`} />
              </>))}
              {g("aleron-trasero", <><path className="bp-fill" d="M4980-520H5290V520H4980z" /><path className="bp-fill" d="M5285-520H5490V520H5285z" /><path className="bp-fill" d="M4960-550H5505V-520H4960zM4960 520H5505V550H4960z" /></>)}
              {dims && <>
                <Dim a={[-250, 950]} b={[-250, -950]} refs={790} text="1.900" />
                <Dim a={[1480, 950]} b={[1480, 670]} refs={-230} text="280" side={-1} />
                <Dim a={[4830, 950]} b={[4830, 575]} refs={-170} text="375" side={-1} />
              </>}
              {notes.map(([id, text, [x1, y1], [x, y]]) => (
                <g key={id} className={`bp-call${on(id)}`} onClick={() => pick(id)}>
                  <line x1={x1} y1={y1} x2={x} y2={y} /><circle className="bp-dot" cx={x1} cy={y1} r={16} />
                  <text x={x} y={y} dy={y < 0 ? "-0.3em" : "1em"} textAnchor="middle">{text}</text>
                </g>
              ))}
            </svg>
          </figure>

          <div className="grid sm:grid-cols-2">
            <figure>
              <figcaption>Vista frontal</figcaption>
              <svg className="bp-small" viewBox="-1250 -1150 2750 1600" role="img" aria-label="Plano frontal del monoplaza">
                <line className="bp-ground" x1={-1150} x2={1150} y1={0} y2={0} /><line className="bp-axis" x1={0} x2={0} y1={-1080} y2={80} />
                {g("aleron-trasero", <>
                  <path className="bp-fill" d="M-550-950H-520V-600H-550zM520-950H550V-600H520zM-520-840H520V-800H-520z" />
                  <path className="bp-fill bp-move" style={{ transformOrigin: "0px -900px", transform: `scaleY(${straight ? 0.3 : 1})` }} d="M-520-940H520V-855H-520z" />
                </>)}
                {g("ruedas", both((s) => <>
                  <rect className="bp-solid" x={s === 1 ? 575 : -950} y={-710} width={375} height={710} rx={60} />
                  <rect className="bp-solid" x={s === 1 ? 670 : -950} y={-700} width={280} height={700} rx={60} />
                  <path className="bp-thin" d={`M${s * 730}-690V-10M${s * 890}-690V-10`} />
                </>))}
                {g("piso", <path className="bp-fill" d="M-760-60H760V-100H-760z" />)}
                {g("chasis", <>
                  {both((s) => <>
                    <path className="bp-fill" d={`M0-560 ${s * 330}-570 ${s * 640}-550Q${s * 710}-540 ${s * 700}-470L${s * 640}-350 ${s * 420}-120H0z`} />
                    <path d={`M${s * 390}-530 ${s * 640}-515 ${s * 630}-420 ${s * 400}-420z`} />
                    <path d={`M${s * 340}-610 ${s * 570}-660M${s * 560}-710H${s * 700}V-640H${s * 560}z`} />
                  </>)}
                  <path className="bp-fill" d="M-130-640Q-150-945 0-945 150-945 130-640z" /><path d="M-85-810Q-95-920 0-920 95-920 85-810 0-780-85-810z" />
                  <path className="bp-fill" d="M-120-640Q-130-850 0-850 130-850 120-640z" /><path d="M-105-735Q0-760 105-735L100-680Q0-700-100-680z" />
                  <path className="bp-fill" d="M-330-560Q-300-655 0-655 300-655 330-560L300-200 200-130H-200L-300-200z" />
                  <path className="bp-fill" d="M-290-600C-270-780-160-838 0-838 160-838 270-780 290-600H250C235-740 150-795 24-797L20-640H-20L-24-797C-150-795-235-740-250-600z" />
                  <path className="bp-fill" d="M-150-430Q0-500 150-430L75-215Q0-180-75-215z" />
                </>)}
                {g("suspension", both((s) => <path d={`M${s * 250}-500 ${s * 690}-420M${s * 260}-420 ${s * 690}-400M${s * 270}-290 ${s * 690}-240M${s * 220}-540 ${s * 690}-270`} />))}
                {g("aleron-delantero", <>
                  <path className="bp-fill" d="M-880-75Q-450-130 0-110 450-130 880-75V-110Q450-165 0-145-450-165-880-110z" />
                  <g className="bp-move" style={{ transformOrigin: "0px -150px", transform: `scaleY(${straight ? 0.35 : 1})` }}>{both((s) => <path className="bp-fill" d={`M${s * 190}-165 ${s * 875}-125V-260L${s * 190}-215zM${s * 190}-190 ${s * 875}-190`} />)}</g>
                  <path d="M-925-60H-880V-290H-900zM880-60H925L900-290H880zM-65-215-75-145M65-215 75-145" />
                </>)}
                {dims && <><Dim a={[-950, 250]} b={[950, 250]} refs={-240} text="1.900" /><Dim a={[1180, 0]} b={[1180, -950]} refs={-220} text="950" side={-1} /></>}
              </svg>
            </figure>
            <dl className="bp-block">
              <div><dt>Plano</dt><dd>Monoplaza F1 2026</dd></div>
              {dimensions.map(([k, v, note]) => <div key={k}><dt>{k}</dt><dd>{v}<small>{note}</small></dd></div>)}
              <div><dt>Cotas</dt><dd>En milímetros, sin escala</dd></div>
            </dl>
          </div>
        </div>

        <div ref={panel} className="scroll-mt-32 scroll-mb-4 rounded-md bg-panel p-5 lg:sticky lg:top-32" aria-live="polite">
          {part ? (
            <>
              <h2 className="text-xl">{parts.indexOf(part) + 1}. {part.name}</h2>
              <p className="mt-2 text-sm text-muted">{part.text}</p>
              <dl className="mt-4">
                {part.specs.map(([k, v]) => <div key={k} className="border-t border-line py-2"><dt className="text-sm text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
              </dl>
            </>
          ) : (
            <>
              <h2 className="text-xl">Elegí una pieza</h2>
              <p className="mt-2 text-sm text-muted">Tocala en el plano o en la lista. Las líneas punteadas son piezas internas.</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Piezas">
        {parts.map((p, i) => <button key={p.id} type="button" aria-pressed={selected === p.id} onClick={() => pick(p.id)} className={button(selected === p.id)}>{i + 1}. {p.name}</button>)}
      </div>
    </div>
  );
}
