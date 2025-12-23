import { clsx } from "clsx";

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
    return (
        <div className={clsx("bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-slate-100 dark:border-zinc-700 overflow-hidden", className)}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children }: CardProps) {
    return <div className={clsx("p-6 border-b border-slate-100 dark:border-zinc-700", className)}>{children}</div>;
}

export function CardContent({ className, children }: CardProps) {
    return <div className={clsx("p-6", className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
    return <h3 className={clsx("text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-white", className)}>{children}</h3>;
}
