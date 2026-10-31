import { ConnectionCard, LabelCard, useConnection } from "../features/gmail";
import { PageHeader } from "../shared/ui";

/** Settings: the live Gmail connection and the Gmail label put on pricing threads. */
export default function SettingsPage() {
  const connection = useConnection();

  return (
    <div className="content">
      <PageHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" subtitle="Manage your connected inbox and the label we add in Gmail." />
      <div className="settings-layout">
        <ConnectionCard connection={connection} />
        <LabelCard />
      </div>
    </div>
  );
}
