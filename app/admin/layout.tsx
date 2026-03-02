export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Admin pages get full-screen layout without public header/footer
    return <div className="min-h-screen bg-background">{children}</div>;
}
