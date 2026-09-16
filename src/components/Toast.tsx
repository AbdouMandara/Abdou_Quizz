export function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible || !message) return null;
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full text-sm text-center animate-fadeIn max-w-[90%]"
      style={{ background: "var(--text)", color: "var(--bg)", boxShadow: "var(--shadow)" }}>
      {message}
    </div>
  );
}
