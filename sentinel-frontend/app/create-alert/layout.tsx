import { Sidebar } from "@/src/components/Sidebar";

export default function CreateAlertLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 shrink-0 border-r border-border bg-surface">
                <Sidebar />
            </aside>
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

