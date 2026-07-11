export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]">
      <div
        className="aurora-blob-a absolute -top-1/4 left-[10%] h-[60vh] w-[60vh] rounded-full opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(circle, #3fc98f, transparent 70%)" }}
      />
      <div
        className="aurora-blob-b absolute top-[20%] right-[5%] h-[55vh] w-[55vh] rounded-full opacity-30 blur-[110px]"
        style={{ background: "radial-gradient(circle, #6a8fff, transparent 70%)" }}
      />
      <div
        className="aurora-blob-c absolute bottom-[-10%] left-[30%] h-[50vh] w-[50vh] rounded-full opacity-25 blur-[110px]"
        style={{ background: "radial-gradient(circle, #b478ff, transparent 70%)" }}
      />
      <div className="bg-grain absolute inset-0" />
    </div>
  );
}