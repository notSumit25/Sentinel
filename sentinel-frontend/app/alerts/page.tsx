import {AlertPanel} from "@/src/components/AlertPanel";

export  default  function AlertsPage() {
    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Alerts</h1>
                <p className="text-slate-500">
                    view triggered alerts
                </p>
            </div>
            <div>
                ALL ALERTS PAGE
            </div>
            <AlertPanel/>
        </section>
    );
}