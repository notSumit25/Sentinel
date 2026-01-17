import {AlertRulesPanel} from "@/src/components/AlertRulesPanel";


export default function AlertRulesPage() {
    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Alert Rules</h1>
                <p className="text-slate-500">
                    manage alerting conditions
                </p>
            </div>
            <div>
                ALL ALERT RULES PAGE
                <AlertRulesPanel/>
            </div>
        </section>
    );
}