let $d = document,
  randomColor = () => {
    col = Math.round(Math.random() * 16777215);
    return [
      "#" + ("000000" + col.toString(16)).slice(-6),
      "#" + ("000000" + (16777215 - col).toString(16)).slice(-6),
    ];
  },
  com = false,
  caso = 1;

class Program {
  constructor(pid, nombre, t_codigo, t_data, t_bss, dir_base) {
    this.pid = pid;
    this.nombre = nombre;
    this.t_disco = encabezado;
    this.t_codigo = t_codigo;
    this.t_data = t_data;
    this.t_bss = t_bss;
    this.memoria = encabezado + stack + heap;
    this.dir_base = dir_base;
  }
  resize() {
    this.t_disco += this.t_codigo + this.t_data + this.t_bss;
    this.memoria += this.t_codigo + this.t_data + this.t_bss;
  }
}

const kernel = 1048576,
  stack = 65536,
  heap = 131072,
  encabezado = 180,
  programas = {
    SO: ["S.O.", 431592, 207365, 916],
    Notepad: [
      "Notepad",
      18654,
      8352,
      166,
      "https://icon-library.com/images/notepad-icon-png/notepad-icon-png-16.jpg",
    ],
    Word: [
      "Word",
      120465,
      25548,
      276,
      "https://icon-library.com/images/icon-word/icon-word-5.jpg",
    ],
    Excel: [
      "Excel",
      167776,
      36426,
      371,
      "https://icon-library.com/images/excel-sheet-icon/excel-sheet-icon-8.jpg",
    ],
    AutoCAD: [
      "AutoCAD",
      369883,
      457842,
      1685,
      "https://icon-library.com/images/autodesk-autocad.png",
    ],
    Calculadora: [
      "Calculadora",
      18280,
      303,
      387,
      "https://icon-library.com/images/windows-calculator-icon/windows-calculator-icon-8.jpg",
    ],
    Chrome: [
      "Chrome",
      384762,
      224288,
      1228,
      "https://icon-library.com/images/chrome-icon/chrome-icon-5.jpg",
    ],
    "Grand Theft Auto V": [
      "Grand Theft Auto V",
      2859361,
      732470,
      9892,
      "https://icon-library.com/images/grand-theft-auto-v-icon/grand-theft-auto-v-icon-20.jpg",
    ],
    Oracle: [
      "Oracle",
      776319,
      814403,
      2764,
      "https://icon-library.com/images/oracle-icon-png/oracle-icon-png-14.jpg",
    ],
  },
  exe = [],
  lanzar = (p) => {
    let pid = 0,
      dir = 0;
    exe.forEach((e) => {
      if (e.pid >= pid) pid = e.pid + 1;
    });
    if (com || exe.length == 0) {
      if (exe.length > 0)
        dir =
          parseInt(exe[exe.length - 1].dir_base, 16) +
          exe[exe.length - 1].memoria;
      let programa = new Program(
        pid,
        p[0],
        p[1],
        p[2],
        p[3],
        ("000000" + dir.toString(16)).slice(-6).toUpperCase()
      );
      programa.resize();
      exe.push(programa);
    } else {
      let disp =
          16777215 -
          (parseInt(exe[exe.length - 1].dir_base, 16) +
            exe[exe.length - 1].memoria),
        index = null,
        cap = encabezado + stack + heap + p[1] + p[2] + p[3];
      switch (caso) {
        case 0: //primer caso
          for (let x = 0; x < exe.length; x++) {
            if (!exe[x].nombre && exe[x].memoria >= cap) {
              index = x;
              break;
            }
          }
          break;
        case 1: //mejor caso
          let libre = disp;
          exe.forEach((e) => {
            if (!e.nombre && e.memoria > disp) disp = e.memoria;
          });
          exe.forEach((e, i) => {
            console.log(e.nombre, e.memoria, cap, disp);
            if (!e.nombre && e.memoria >= cap && e.memoria <= disp) {
              disp = e.memoria;
              index = i;
            }
          });
          if (libre < disp) index = null;
          break;
        case 2: //peor caso
          exe.forEach((e, i) => {
            if (!e.nombre && e.memoria >= cap && e.memoria >= disp) {
              disp = e.memoria;
              index = i;
            }
          });
          break;
      }
      let programa = new Program(pid, p[0], p[1], p[2], p[3]);
      programa.resize();
      if (index) {
        programa.dir_base = exe[index].dir_base;
        exe[index].dir_base = (parseInt(exe[index].dir_base, 16) + cap)
          .toString(16)
          .toUpperCase();
        exe[index].memoria -= cap;
        exe[index].memoria === 0
          ? exe.splice(index, 1, programa)
          : exe.splice(index, 0, programa);
      } else {
        programa.dir_base = (
          parseInt(exe[exe.length - 1].dir_base, 16) +
          exe[exe.length - 1].memoria
        )
          .toString(16)
          .toUpperCase();
        exe.push(programa);
      }
    }
  };

let drawProc = () => {
    let proc = $d.querySelector(".proc");
    proc.innerHTML = `<article><span>PID</span></article>
      <article><span>Nombre</span></article>
      <article><span>Tamaño en disco</span></article>
      <article><span>Tamaño codigo</span></article>
      <article><span>Datos inicializados</span></article>
      <article><span>Datos sin inicializar</span></article>
      <article><span>Memoria inicial</span></article>
      <article><span>Memoria inicial (KiB)</span></article>
      <article><span>Dir base</span></article>`;
    exe.forEach((e) => {
      let $articles = ``;
      if (e.nombre) {
        for (const key in e) {
          if (key === "dir_base") {
            $articles += `<article><span>${
              parseInt((e.memoria / 1024) * 100) / 100
            }</span></article>`;
          }
          $articles += `<article><span>${e[key]}</span></article>`;
        }
        proc.innerHTML += $articles;
      }
    });
  },
  drawRam = () => {
    let libre =
      16777215 -
      (parseInt(exe[exe.length - 1].dir_base, 16) +
        exe[exe.length - 1].memoria);
    $ram = $d.querySelector(".ram");
    $ram.innerHTML = "";
    exe.forEach((e) => {
      col = randomColor();
      let $article = $d.createElement("article"),
        $span = $d.createElement("span");
      $span.textContent = e.nombre;
      $article.dataset.Proceso = e.pid;
      $article.dataset.Direccion = e.dir_base;
      $article.dataset.Memoria = e.memoria;
      $article.appendChild($span);
      if (!e.nombre) col[0] = col[1] = "#ddd";
      $article.setAttribute(
        "style",
        `background: ${col[0]};text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em ${col[1]}, 0 0 2em black;flex-grow: ${e.memoria}`
      );
      $ram.appendChild($article);
    });
    (() => {
      let $article = $d.createElement("article");
      $article.classList.add("libre");
      $article.setAttribute("style", `flex-grow: ${libre}`);
      $article.dataset.Proceso = "";
      $article.dataset.Direccion = (
        parseInt(exe[exe.length - 1].dir_base, 16) + exe[exe.length - 1].memoria
      )
        .toString(16)
        .toUpperCase();
      $article.dataset.Memoria = libre;
      $ram.appendChild($article);
    })();
  },
  events = () => {
    $d.querySelectorAll(".icons figure").forEach((e) => {
      e.addEventListener("click", (fig) => {
        Array(...e.parentElement.children).forEach((f) => {
          f.classList.remove("figclick");
        });
        let $figure = fig.target;
        while (!$figure.matches("figure")) $figure = $figure.parentNode;
        $figure.classList.add("figclick");
      });
      e.addEventListener("dblclick", (fig) => {
        let $figure = fig.target,
          libre =
            16777215 -
            (parseInt(exe[exe.length - 1].dir_base, 16) +
              exe[exe.length - 1].memoria);
        while (!$figure.matches("figure")) $figure = $figure.parentNode;
        let programa = programas[$figure.children[1].children[0].textContent],
          capacidad =
            encabezado + stack + heap + programa[1] + programa[2] + programa[3];
        let nones = exe.filter((e) => !e.nombre),
          disp = false;
        nones.forEach((e) => {
          if (capacidad <= e.memoria) disp = true;
        });
        if (capacidad <= libre || disp) {
          lanzar(programa);
          drawProc();
          drawRam();
          drawMem();
          console.log(exe);
        } else {
          alert("No hay memoria suficiente");
        }
      });
    });

    let $ram = $d.querySelector(".ram");
    $ram.addEventListener("click", (e) => {
      let $article = e.target;
      while (!$article.matches("article")) $article = $article.parentNode;
      drawStats($article);
    });
    $ram.addEventListener("dblclick", (e) => {
      let segs = Array(...$d.querySelector(".ram").children),
        $article = e.target;
      while (!$article.matches("article")) $article = $article.parentNode;
      let index = exe.indexOf(exe[segs.indexOf($article)]),
        memoria = exe[index].memoria;
      if (index && exe[index].pid) {
        if (com) {
          exe.splice(index, 1);
          exe.forEach((e, i) => {
            if (i >= index)
              e.dir_base = (parseInt(e.dir_base, 16) - memoria)
                .toString(16)
                .toUpperCase();
          });
        } else {
          let none = new Program();
          none.pid = "";
          none.memoria = memoria;
          none.dir_base = exe[index].dir_base;
          index === exe.length - 1 ? exe.pop() : (exe[index] = none);
          for (let x = 1; x < exe.length; x++) {
            if (!exe[x - 1].nombre && !exe[x].nombre) {
              console.log(exe[x - 1], exe[x]);
              exe[x - 1].memoria += exe[x].memoria;
              exe.splice(x, 1);
              x--;
            }
          }
          if (!exe[exe.length - 1].nombre) exe.pop();
          console.log(exe);
        }
        drawProc();
        drawRam();
        drawMem();
      }
    });
  },
  drawSO = () => {
    let $so = $d.querySelector(".so");
    $so.innerHTML += `<span>Stack: ${stack}</span>
      <span>Heap: ${heap}</span>
      <span>Encabezado: ${encabezado}</span>`;
  },
  drawStats = ($sel) => {
    let $prog = $d.querySelector(".prog");
    $prog.innerHTML = "<span><b>Detalles de programa</b></span>";
    for (const key in $sel.dataset) {
      $prog.innerHTML += `<span>${key}: ${$sel.dataset[key]}</span>`;
    }
  },
  drawMem = () => {
    let $mem = $d.querySelector(".mem"),
      usada = 0;
    exe.forEach((e) => {
      if (e.nombre) usada += e.memoria;
    });
    let prc = Math.round((usada / 16777215) * 100),
      red = 0;
    green = 0;
    if (prc > 50) {
      red = 255;
      green = 255 - (prc - 50) * 5.1;
    }
    if (prc < 50) {
      green = 255;
      red = prc * 5.1;
    }
    if (prc == 50) green = red = 255;

    $mem.innerHTML = `<span><b>Memoria</b></span>
      <span>Ocupada: ${usada}</span>
      <span>Libre: ${16777215 - usada}</span>
      <div class="prc">
        <div><div style="width: ${prc}%;background-color: rgb(${red},${green},0);"></div></div>
        <span>${prc}%</span>
      </div>`;
  };

(() => {
  lanzar(programas.SO);
  for (let p in programas) {
    if (programas[p][0] !== "S.O.") {
      fig = `<figure>
    <img src="${programas[p][4]}" alt=" ">
    <figcaption><span>${programas[p][0]}</span></figcaption>
  </figure>`;
      $d.querySelector(".icons").innerHTML += fig;
    }
  }
  drawProc();
  drawRam();
  drawSO();
  drawStats($d.querySelector(".ram article"));
  drawMem();
  events();
})();
