interface Props {
  hosts: string[];
  value: string;
  onChange: (v: string) => void;
}

export function HostFilter({ hosts, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3  border px-3 py-1.5 rounded-lg bg-gray-700 ">
      <label className="text-xs font-bold uppercase text-slate-300">
        Source:
      </label>

      <select
        className="bg-transparent text-sm font-semibold focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Hosts</option>
        {hosts.map((h) => (
          <option className="bg-gray-400" key={h} value={h}>
            Host {h}
          </option>
        ))}
      </select>
    </div>
  );
}
