import { Check } from "lucide-react";
import { Cursor } from "./Cursor";

/** Miniature Needs review: an unclear email waits, the pointer approves it and it is marked done. */
export function ReviewPreview() {
  return (
    <div className="m-review">
      <div className="m-card m-rcard">
        <div className="m-rhead"><span className="m-tag warn">Needs review</span><span className="m-line w40" /></div>
        <span className="m-line w90" />
        <span className="m-line w70" />
        <div className="m-actions"><span className="m-btn">Dismiss</span><span className="m-btn primary m-approve">Approve</span></div>
        <div className="m-done"><Check size={14} /> Approved</div>
      </div>
      <Cursor className="cursor-review" />
    </div>
  );
}
