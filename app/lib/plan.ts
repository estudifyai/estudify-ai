import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<"free" | "pro" | "team"> {
  const { data } = await supabase
    .from("user_plans")
    .select("plan, status")
    .eq("user_id", userId)
    .maybeSingle();
  if (data && data.status === "active" && data.plan !== "free") {
    return data.plan as "pro" | "team";
  }
  return "free";
}

export async function countMaterialsThisMonth(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());
  return count || 0;
}

export const FREE_MATERIALS_LIMIT = 3;
