"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function Student({
  x,
  y,
  color,
  hair,
  name,
}: {
  x: number;
  y: number;
  color: string;
  hair: string;
  name: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`} className={`student student-${color}`}>
      <g className="student-body">
        <path
          className="scene-trousers"
          d="M-28 84 -32 146 -12 146 0 106 11 146 31 146 24 82Z"
        />
        <path
          className="scene-shoe"
          d="M-32 142 -12 142 -10 152 -42 152Q-44 145-32 142M12 142 31 142Q44 145 42 152H10Z"
        />
        <path
          className={`shirt-${color}`}
          d="M-17 16Q-36 17-42 36L-48 77 -33 83 -22 51 -25 91Q0 100 27 91L24 50 34 79 49 72 41 36Q35 16 17 16Z"
        />
        <path className="scene-skin" d="M-10 4H10V23Q0 32-10 23Z" />
        <ellipse className="scene-skin" cy="-13" rx="24" ry="29" />
        <path className="scene-hair" d={hair} />
        <path className="face-detail" d="M-10-12h2m17 0h2M-5 2Q0 8 7 1" />
        <path className="face-nose" d="m1-10-2 7h4" />
        <path
          className="scene-skin arm"
          d="M-43 67Q-49 72-43 84L-26 86Q-18 82-26 76L-35 73Z"
        />
        <path className="scene-skin" d="M36 65 32 81Q32 90 42 86L48 72Z" />
        {name === "purple" && (
          <g className="student-plane">
            <path className="scene-paper" d="m34 42 68-18-27 36-13-12Z" />
            <path className="plane-detail" d="m62 48 40-24-50 20" />
          </g>
        )}
        {name === "orange" && (
          <g className="stealing-arm">
            <path
              className="scene-skin"
              d="M32 44Q43 38 56 34L95 30Q106 25 109 32Q116 33 110 41L98 43 56 51 37 58Z"
            />
          </g>
        )}
      </g>
      <g className="laugh-marks">
        <path d="m-37-25-10-6m11 19-12-1m81-12 10-6m-11 19 12-1" />
      </g>
    </g>
  );
}

export function CanteenScene() {
  const [active, setActive] = useState<string | null>(null);

  const react = (name: string) =>
    setActive((previous) => (previous === name ? null : name));

  const students = [
    {
      name: "green",
      label: "Laugh with the green student",
      x: 268,
      y: 262,
      hair: "M-24-12Q-32-47-7-45Q12-56 25-33L25-12 15-28Q-4-17-18-27L-24-12Z",
    },
    {
      name: "orange",
      label: "Catch the orange student stealing a samosa",
      x: 409,
      y: 262,
      hair: "M-24-14Q-28-45-11-44L-5-52 3-45 14-49 17-42Q31-36 24-11L17-27Q0-20-18-27Z",
    },
    {
      name: "blue",
      label: "Ask the blue student about the missing samosa",
      x: 584,
      y: 262,
      hair: "M-25 3Q-37-45-8-45Q30-50 27 7L19-6 17-31Q-2-19-19-27L-18-4Z",
    },
    {
      name: "purple",
      label: "Help the purple student launch a paper plane",
      x: 736,
      y: 262,
      hair: "M-24-14Q-32-50 3-47Q30-43 24-11L15-27-17-27Z",
    },
  ];

  return (
    <div className={`canteen-art ${active ? `react-${active}` : ""}`}>
      <svg
        viewBox="0 0 1120 440"
        role="img"
        aria-labelledby="canteen-title canteen-description"
      >
        <title id="canteen-title">An afternoon at the campus canteen</title>
        <desc id="canteen-description">
          Four friends share chai and samosas on a bench. An orange-shirted
          student steals a snack while a purple-shirted friend launches a paper
          plane beside a colourful canteen.
        </desc>
        <defs>
          <pattern
            id="awning"
            width="120"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect className="shirt-green" width="30" height="100" />
            <rect className="shirt-blue" x="30" width="30" height="100" />
            <rect className="shirt-purple" x="60" width="30" height="100" />
            <rect className="shirt-orange" x="90" width="30" height="100" />
          </pattern>
        </defs>
        <path
          className="scene-cloud"
          d="M62 119Q35 119 38 101Q39 84 61 83Q68 54 97 67Q108 43 132 60Q155 51 164 76Q192 75 190 98Q191 118 163 119ZM601 69Q578 68 583 53Q588 37 604 42Q609 19 633 30Q652 15 670 36Q696 36 697 55Q695 69 673 69Z"
        />
        <path
          className="scene-skyline"
          d="M0 302V207H51V163H108V204H146V144H220V231H282V174H335V276H791V159H852V113H900V178H952V234H1008V162H1062V207H1120V368H0Z"
        />
        <g className="building-windows">
          <path d="M166 164h14v20h-14Zm29 0h14v20h-14Zm-29 35h14v20h-14Zm29 0h14v20h-14ZM863 137h14v20h-14Zm29 62h14v20h-14ZM1030 182h14v20h-14Z" />
        </g>
        <path
          className="scene-ground"
          d="M0 351Q189 327 337 350Q486 373 689 349Q921 321 1120 350V440H0Z"
        />
        <g className="scene-tree">
          <path className="tree-trunk" d="M100 207H112V360H100Z" />
          <path
            className="tree-foliage"
            d="M105 105Q52 131 61 161Q30 186 55 211Q30 241 58 258Q101 280 141 255Q167 243 149 217Q180 184 148 157Q158 126 105 105Z"
          />
          <path className="tree-branch" d="M106 307V169m0 65-29-25m29 57 29-27" />
        </g>
        <g transform="translate(840 113)">
          <rect
            className="counter-wall"
            x="-12"
            y="44"
            width="235"
            height="229"
            rx="3"
          />
          <rect
            className="counter-window"
            x="6"
            y="88"
            width="199"
            height="115"
          />
          <path className="counter-frame" d="M-25 198H238V211H-25Z" />
          <path fill="url(#awning)" d="M0 0H213L244 62H-29Z" />
          <path
            fill="url(#awning)"
            d="M-29 60H244V75Q227 91 214 75Q198 91 184 75Q168 91 154 75Q139 91 124 75Q109 91 94 75Q79 91 64 75Q49 91 34 75Q19 91 4 75Q-13 91-29 75Z"
          />
          <rect
            className="canteen-sign"
            x="30"
            y="-29"
            width="150"
            height="44"
            rx="5"
          />
          <text className="sign-text" x="105" y="0" textAnchor="middle">
            CANTEEN
          </text>
          <path className="shelf-line" d="M22 128H191" />
          <g className="shelf-cups">
            <path d="M34 108h20l-3 18H37Zm40 0h20l-3 18H77Zm40 0h20l-3 18h-14Z" />
          </g>
          <g transform="translate(135 162)">
            <path className="chai-cup" d="M0 0H31L26 33H5Z" />
            <path className="cup-handle" d="M30 5Q49 4 42 20L29 23" />
            <path className="steam steam-one" d="M8-5Q-1-15 8-24T8-44" />
            <path className="steam steam-two" d="M23-8Q14-19 23-29T23-43" />
          </g>
          <text className="counter-caption" x="105" y="245" textAnchor="middle">
            CHAI · SAMOSA · GOOD COMPANY
          </text>
        </g>
        <ellipse
          className="ground-shadow"
          cx="502"
          cy="399"
          rx="327"
          ry="14"
        />
        <path className="bench-leg" d="M232 330H248V398H232ZM733 330H749V398H733Z" />
        <rect
          className="bench-back"
          x="209"
          y="269"
          width="561"
          height="19"
          rx="4"
        />
        <rect
          className="bench-back"
          x="209"
          y="296"
          width="561"
          height="16"
          rx="4"
        />
        {students.map((student) => (
          <Student key={student.name} {...student} color={student.name} />
        ))}
        <path className="bench-seat" d="M198 346H783V360H198Z" />
        <g className="samosa" transform="translate(513 334)">
          <ellipse className="plate" cy="8" rx="29" ry="7" />
          <path
            className="samosa-food"
            d="M-15 1 0-24 17 1Q2 9-15 1Z"
          />
          <path className="samosa-detail" d="m-5-3 5-11 8 13" />
        </g>
        <g transform="translate(307 331)">
          <path className="chai-cup" d="M0 0h17l-3 19H3Z" />
          <path className="steam steam-one" d="M7-3Q0-10 7-17T7-30" />
        </g>
        <g
          className="scene-book"
          transform="translate(668 340) rotate(-6)"
        >
          <path className="shirt-blue" d="M-22-10H25V4H-22Z" />
          <path className="scene-paper" d="M-20-7H22V0H-20Z" />
        </g>
        <g className="scene-bag" transform="translate(184 365)">
          <rect
            className="shirt-purple"
            width="39"
            height="49"
            rx="11"
          />
          <path className="bag-detail" d="M10 1V-8Q20-17 29-8V1M7 22H32V41H7Z" />
        </g>
        <g className="scene-flight">
          <path className="scene-paper" d="m681 187 58-20-22 35-12-11Z" />
          <path className="plane-detail" d="m705 191 34-24-41 21" />
        </g>
        <g className="bubble bubble-one">
          <path
            className="bubble-fill"
            d="M194 128H390Q402 128 402 140V175Q402 187 390 187H292L273 205V187H194Q182 187 182 175V140Q182 128 194 128Z"
          />
          <text x="292" y="163" textAnchor="middle">
            Bunk the 2pm lecture?
          </text>
        </g>
        <g className="bubble bubble-two">
          <path
            className="bubble-fill"
            d="M454 122H667Q679 122 679 134V173Q679 185 667 185H598L583 207V185H454Q442 185 442 173V134Q442 122 454 122Z"
          />
          <text x="560" y="157" textAnchor="middle">
            Who took my samosa?!
          </text>
        </g>
        <g className="bubble bubble-three">
          <path
            className="bubble-fill"
            d="M325 137H480Q492 137 492 149V184Q492 196 480 196H426L409 215V196H325Q313 196 313 184V149Q313 137 325 137Z"
          />
          <text x="403" y="171" textAnchor="middle">
            Wasn&apos;t me 😇
          </text>
        </g>
      </svg>
      <div className="student-controls">
        {students.map((student) => (
          <Button
            variant="character"
            key={student.name}
            className={`character-hit hit-${student.name}`}
            aria-label={student.label}
            aria-pressed={active === student.name}
            onClick={() => react(student.name)}
          />
        ))}
      </div>
      <span className="sr-only" role="status">
        {active === "orange"
          ? "Wasn't me 😇"
          : active === "blue"
          ? "Who took my samosa?!"
          : active === "purple"
          ? "A paper plane takes flight."
          : active === "green"
          ? "Bunk the 2pm lecture?"
          : ""}
      </span>
    </div>
  );
}
