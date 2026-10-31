/** Window around a miniature page preview. The animation plays while it is hovered, focused or tapped. */
export function PreviewFrame({ title, children }) {
  return (
    <div className="gp-frame" tabIndex={0} role="img" aria-label={`Animated preview of the ${title} page. Hover over it, focus it or tap it to play.`}>
      <div className="gp-window" aria-hidden="true">
        <div className="gp-chrome"><i /><i /><i /></div>
        <div className="gp-screen">{children}</div>
      </div>
    </div>
  );
}
