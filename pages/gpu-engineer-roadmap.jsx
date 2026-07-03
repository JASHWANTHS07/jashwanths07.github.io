import { useState, useEffect } from "react";

// ---------- DATA ----------
const PHASES = [
  {
    id: "found",
    code: "P0",
    title: "Foundations",
    subtitle: "The bedrock — nothing above works without this",
    window: "Jul – Oct 2026",
    color: "#B87333",
    sections: [
      {
        name: "C & C++ (the language of GPUs)",
        items: [
          { id: "cpp1", text: "Pointers, arrays, memory layout, stack vs heap" },
          { id: "cpp2", text: "Manual memory management: malloc/free, new/delete, leaks" },
          { id: "cpp3", text: "RAII, smart pointers, move semantics" },
          { id: "cpp4", text: "Templates + basic metaprogramming (CUDA APIs use these heavily)" },
          { id: "cpp5", text: "Build one non-trivial C++ project (e.g. a matrix library or allocator)" },
        ],
      },
      {
        name: "Computer architecture",
        items: [
          { id: "arch1", text: "CPU pipeline, ILP, branch prediction (Hennessy & Patterson ch. 1–3)" },
          { id: "arch2", text: "Memory hierarchy: caches, cache lines, latency vs bandwidth" },
          { id: "arch3", text: "Virtual memory, TLBs, page tables" },
          { id: "arch4", text: "Read x86/ARM assembly at a basic level (Godbolt is your friend)" },
          { id: "arch5", text: "SIMD concepts: vectorization, AVX intrinsics (write one SIMD loop)" },
        ],
      },
      {
        name: "Systems & tooling",
        items: [
          { id: "sys1", text: "Linux fluency: gdb, valgrind, perf, strace" },
          { id: "sys2", text: "OS basics: threads, sync primitives, context switches" },
          { id: "sys3", text: "CMake + compiling/linking mental model (what -O3 actually does)" },
        ],
      },
    ],
  },
  {
    id: "cuda",
    code: "P1",
    title: "GPU Architecture & CUDA",
    subtitle: "Where the scarcity begins",
    window: "Oct 2026 – Feb 2027",
    color: "#2E6E4E",
    sections: [
      {
        name: "GPU architecture mental model",
        items: [
          { id: "gpu1", text: "SMs, warps, thread blocks, grids — the execution hierarchy" },
          { id: "gpu2", text: "Occupancy, register pressure, warp divergence" },
          { id: "gpu3", text: "Memory spaces: global, shared, registers, L1/L2, constant" },
          { id: "gpu4", text: "Read the NVIDIA GPU whitepaper for one recent arch (Hopper/Blackwell)" },
        ],
      },
      {
        name: "CUDA programming (PMPP book, ch. 1–12)",
        items: [
          { id: "cu1", text: "First kernels: vector add, SAXPY — grasp the launch model" },
          { id: "cu2", text: "Memory coalescing — measure the difference yourself" },
          { id: "cu3", text: "Shared-memory tiled matrix multiply (the rite of passage)" },
          { id: "cu4", text: "Reductions & scans: warp shuffles, atomics" },
          { id: "cu5", text: "Streams, async copies, overlapping compute & transfer" },
          { id: "cu6", text: "Profile everything with Nsight Compute — learn to read the metrics" },
        ],
      },
      {
        name: "The classic kernel set (your proof of skill)",
        items: [
          { id: "ck1", text: "Optimized SGEMM from scratch — iterate toward cuBLAS % (blog each step)" },
          { id: "ck2", text: "Softmax, LayerNorm, fused elementwise kernels" },
          { id: "ck3", text: "Compare your kernels vs cuBLAS/cuDNN and explain the gap" },
        ],
      },
    ],
  },
  {
    id: "triton",
    code: "P2",
    title: "ML Kernels & Triton",
    subtitle: "Bridging your AI background to the metal",
    window: "Feb – May 2027",
    color: "#4A5D8A",
    sections: [
      {
        name: "Triton",
        items: [
          { id: "tr1", text: "Triton programming model: blocks not threads" },
          { id: "tr2", text: "Rewrite your matmul + softmax in Triton, benchmark vs CUDA" },
          { id: "tr3", text: "Write one fused kernel (e.g. bias + GELU + dropout)" },
        ],
      },
      {
        name: "Attention & transformer internals",
        items: [
          { id: "fa1", text: "Read the FlashAttention paper until the tiling math is obvious" },
          { id: "fa2", text: "Re-implement a minimal FlashAttention in Triton" },
          { id: "fa3", text: "Understand KV-cache, quantized inference kernels (INT8/FP8)" },
        ],
      },
      {
        name: "Framework internals",
        items: [
          { id: "fw1", text: "PyTorch internals: dispatcher, ATen, custom C++/CUDA extensions" },
          { id: "fw2", text: "torch.compile / TorchInductor — read the generated Triton code" },
        ],
      },
    ],
  },
  {
    id: "comp",
    code: "P3",
    title: "Compilers: LLVM & MLIR",
    subtitle: "The rarest layer — a few thousand people worldwide",
    window: "May – Sep 2027 (into MS)",
    color: "#8A3B3B",
    sections: [
      {
        name: "Compiler theory (just enough)",
        items: [
          { id: "ct1", text: "Lexing, parsing, ASTs — build a tiny language interpreter" },
          { id: "ct2", text: "IRs and SSA form — why compilers think in SSA" },
          { id: "ct3", text: "Core optimizations: DCE, CSE, inlining, loop transforms" },
        ],
      },
      {
        name: "LLVM",
        items: [
          { id: "llvm1", text: "Do the official 'Kaleidoscope' LLVM tutorial end-to-end" },
          { id: "llvm2", text: "Read LLVM IR fluently; map C++ → IR on Godbolt" },
          { id: "llvm3", text: "Write a custom LLVM pass (e.g. an instruction counter, then a real transform)" },
        ],
      },
      {
        name: "MLIR & GPU codegen",
        items: [
          { id: "mlir1", text: "MLIR concepts: dialects, ops, lowering pipelines" },
          { id: "mlir2", text: "Do the MLIR 'Toy' tutorial; build a tiny dialect" },
          { id: "mlir3", text: "Study how Triton lowers to PTX; read PTX and some SASS" },
          { id: "mlir4", text: "First open-source PR to Triton, MLIR, or LLVM (even docs/tests count)" },
        ],
      },
    ],
  },
  {
    id: "port",
    code: "P4",
    title: "Portfolio & Sweden Pipeline",
    subtitle: "Converting skill into the NVIDIA door",
    window: "Parallel track → Autumn 2027",
    color: "#6B5B8A",
    sections: [
      {
        name: "Portfolio artifacts",
        items: [
          { id: "pf1", text: "GitHub: CUDA kernel library with benchmarks + writeups" },
          { id: "pf2", text: "One deep blog series (e.g. 'SGEMM: from 5% to 80% of cuBLAS')" },
          { id: "pf3", text: "One merged open-source contribution in the Triton/LLVM ecosystem" },
        ],
      },
      {
        name: "Application milestones",
        items: [
          { id: "ap1", text: "IELTS/TOEFL booked & done by Sep 2026" },
          { id: "ap2", text: "SOP tying AI experience → GPU compiler goal (rare, credible story)" },
          { id: "ap3", text: "Apply mid-Oct 2026 – mid-Jan 2027: Lund SoC, KTH Embedded, Chalmers EESD" },
          { id: "ap4", text: "Chalmers IPOET/Volvo + KTH India scholarship forms submitted" },
        ],
      },
      {
        name: "In Sweden (Autumn 2027 →)",
        items: [
          { id: "sw1", text: "Pick thesis-track courses: computer architecture, VLSI, compilers" },
          { id: "sw2", text: "Contact NVIDIA Lund / Arm Lund engineers by month 2 (exjobb pipeline)" },
          { id: "sw3", text: "Land master's thesis inside NVIDIA/Arm/Ericsson — the standard hire door" },
        ],
      },
    ],
  },
];

const ALL_ITEMS = PHASES.flatMap((p) => p.sections.flatMap((s) => s.items.map((i) => i.id)));
const STORAGE_KEY = "gpu-roadmap-checked-v1";

// ---------- COMPONENT ----------
export default function GpuRoadmap() {
  const [checked, setChecked] = useState({});
  const [open, setOpen] = useState({ found: true });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setChecked(JSON.parse(r.value));
      } catch (e) {
        /* first run — nothing saved yet */
      }
      setLoaded(true);
    })();
  }, []);

  const persist = async (next) => {
    setChecked(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("save failed", e);
    }
  };

  const toggle = (id) => persist({ ...checked, [id]: !checked[id] });

  const phaseStats = (p) => {
    const ids = p.sections.flatMap((s) => s.items.map((i) => i.id));
    const done = ids.filter((id) => checked[id]).length;
    return { done, total: ids.length, pct: ids.length ? done / ids.length : 0 };
  };

  const totalDone = ALL_ITEMS.filter((id) => checked[id]).length;
  const totalPct = Math.round((totalDone / ALL_ITEMS.length) * 100);

  const S = styles;

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        .chk:focus-visible { outline: 2px solid #B87333; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {/* Header */}
      <header style={S.header}>
        <div style={S.eyebrow}>ROADMAP · REV 1.0 · JUL 2026 → AUTUMN 2027</div>
        <h1 style={S.h1}>GPU Compiler & Kernel Engineer</h1>
        <p style={S.sub}>
          The full stack from C++ to MLIR — the track where NVIDIA-grade scarcity lives.
          Progress saves automatically on this device.
        </p>
      </header>

      {/* Die floorplan */}
      <div style={S.dieWrap}>
        <div style={S.dieLabel}>
          DIE FLOORPLAN — {totalPct}% FABRICATED ({totalDone}/{ALL_ITEMS.length})
        </div>
        <div style={S.die}>
          {PHASES.map((p) => {
            const st = phaseStats(p);
            return (
              <button
                key={p.id}
                className="chk"
                onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
                style={{
                  ...S.dieBlock,
                  borderColor: p.color,
                  background: `linear-gradient(to top, ${p.color}${st.pct === 1 ? "" : "55"} ${Math.round(
                    st.pct * 100
                  )}%, #1A2332 ${Math.round(st.pct * 100)}%)`,
                }}
                aria-label={`${p.title}: ${st.done} of ${st.total} done`}
              >
                <span style={S.dieCode}>{p.code}</span>
                <span style={S.diePct}>{Math.round(st.pct * 100)}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phases */}
      {PHASES.map((p) => {
        const st = phaseStats(p);
        const isOpen = !!open[p.id];
        return (
          <section key={p.id} style={S.phase}>
            <button className="chk" onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))} style={S.phaseHead}>
              <div style={{ ...S.phaseCode, background: p.color }}>{p.code}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.phaseTitle}>{p.title}</div>
                <div style={S.phaseSub}>{p.subtitle}</div>
                <div style={S.phaseWin}>{p.window}</div>
              </div>
              <div style={S.phaseCount}>
                {st.done}/{st.total}
                <span style={{ marginLeft: 8, opacity: 0.5 }}>{isOpen ? "−" : "+"}</span>
              </div>
            </button>
            {/* progress rule */}
            <div style={S.rule}>
              <div style={{ ...S.ruleFill, width: `${st.pct * 100}%`, background: p.color }} />
            </div>

            {isOpen &&
              p.sections.map((sec) => (
                <div key={sec.name} style={S.section}>
                  <div style={S.secName}>{sec.name}</div>
                  {sec.items.map((it) => (
                    <label key={it.id} style={S.item}>
                      <input
                        className="chk"
                        type="checkbox"
                        checked={!!checked[it.id]}
                        onChange={() => toggle(it.id)}
                        style={S.box}
                      />
                      <span
                        style={{
                          ...S.itemText,
                          textDecoration: checked[it.id] ? "line-through" : "none",
                          opacity: checked[it.id] ? 0.45 : 1,
                        }}
                      >
                        {it.text}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
          </section>
        );
      })}

      <footer style={S.footer}>
        Order matters: P0 → P1 → P2 → P3. P4 runs in parallel from day one.
        {!loaded && " · loading saved progress…"}
      </footer>
    </div>
  );
}

// ---------- STYLES ----------
const styles = {
  page: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: "#EEF1F4",
    color: "#1A2332",
    minHeight: "100vh",
    padding: "20px 14px 60px",
    maxWidth: 760,
    margin: "0 auto",
  },
  header: { marginBottom: 22 },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#B87333",
    fontWeight: 600,
    marginBottom: 8,
  },
  h1: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, lineHeight: 1.15, margin: 0, fontWeight: 600 },
  sub: { fontSize: 13.5, lineHeight: 1.5, color: "#4a5568", marginTop: 8, maxWidth: 520 },
  dieWrap: { marginBottom: 26 },
  dieLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "#4a5568",
    marginBottom: 8,
  },
  die: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 6,
    background: "#1A2332",
    padding: 10,
    borderRadius: 6,
  },
  dieBlock: {
    aspectRatio: "1 / 1.4",
    border: "1.5px solid",
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 6,
    cursor: "pointer",
    transition: "background 0.4s",
  },
  dieCode: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: "#EEF1F4" },
  diePct: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#EEF1F4", opacity: 0.85 },
  phase: { background: "#fff", border: "1px solid #d5dae2", borderRadius: 8, marginBottom: 14, overflow: "hidden" },
  phaseHead: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    width: "100%",
    padding: "14px 14px 10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
  },
  phaseCode: {
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 4,
    padding: "4px 7px",
    flexShrink: 0,
  },
  phaseTitle: { fontSize: 16.5, fontWeight: 600, color: "#1A2332" },
  phaseSub: { fontSize: 12.5, color: "#4a5568", marginTop: 2 },
  phaseWin: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: "#B87333",
    marginTop: 4,
    letterSpacing: "0.04em",
  },
  phaseCount: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: "#4a5568",
    flexShrink: 0,
    paddingTop: 4,
  },
  rule: { height: 3, background: "#e7ebf0" },
  ruleFill: { height: "100%", transition: "width 0.3s" },
  section: { padding: "10px 14px 4px" },
  secName: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#4a5568",
    margin: "6px 0 8px",
  },
  item: { display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", cursor: "pointer" },
  box: { width: 18, height: 18, marginTop: 1, accentColor: "#B87333", cursor: "pointer", flexShrink: 0 },
  itemText: { fontSize: 13.5, lineHeight: 1.45 },
  footer: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#4a5568",
    textAlign: "center",
    marginTop: 10,
  },
};
