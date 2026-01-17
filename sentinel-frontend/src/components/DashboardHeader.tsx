import { HostFilter } from "./HostFilter";

interface Props {
    email: string;
    loading: boolean;
    hosts: string[];
    selectedHost: string;
    setSelectedHost: (v: string) => void;
}

export function DashboardHeader({
                                    email,
                                    loading,
                                    hosts,
                                    selectedHost,
                                    setSelectedHost,
                                }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 ">
            <div>
                <h1 className="text-3xl font-bold">System Metrics</h1>
                <p className="text-slate-500">
                    Real-time monitoring for {email}
                </p>
            </div>

            <HostFilter
                hosts={hosts}
                value={selectedHost}
                onChange={setSelectedHost}
            />
        </div>
    );
}
