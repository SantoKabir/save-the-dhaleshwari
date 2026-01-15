import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // User is guaranteed to be authenticated by middleware
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch volunteer applications
    const { data: applications, error } = await supabase
        .from("volunteer_applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error);
    }

    return (
        <AdminDashboard
            applications={applications || []}
            userEmail={user?.email || ""}
        />
    );
}
