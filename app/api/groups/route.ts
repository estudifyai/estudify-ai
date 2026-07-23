import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseAsUser(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    const supabase = supabaseAsUser(token);

    const { action, userId, groupName, joinCode, groupId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    // ═══ CREATE GROUP ═══
    if (action === "create") {
      if (!groupName || groupName.trim().length < 2) {
        return NextResponse.json(
          { error: "El nombre del grupo debe tener al menos 2 caracteres." },
          { status: 400 }
        );
      }

      const code = generateJoinCode();

      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName.trim(),
          owner_id: userId,
          join_code: code,
        })
        .select("id, name, join_code")
        .single();

      if (groupError) {
        console.error("Create group error:", groupError);
        return NextResponse.json(
          { error: "Error creando grupo." },
          { status: 500 }
        );
      }

      // Add owner as member
      await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "owner",
      });

      return NextResponse.json({ group });
    }

    // ═══ JOIN GROUP ═══
    if (action === "join") {
      if (!joinCode || joinCode.trim().length < 4) {
        return NextResponse.json(
          { error: "Código inválido." },
          { status: 400 }
        );
      }

      const { data: group, error: findError } = await supabase
        .from("groups")
        .select("id, name")
        .eq("join_code", joinCode.trim().toUpperCase())
        .single();

      if (findError || !group) {
        return NextResponse.json(
          { error: "No se encontró un grupo con ese código." },
          { status: 404 }
        );
      }

      // Check if already member
      const { data: existing } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", group.id)
        .eq("user_id", userId)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "Ya eres miembro de este grupo." },
          { status: 400 }
        );
      }

      await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "member",
      });

      return NextResponse.json({ group });
    }

    // ═══ LEAVE GROUP ═══
    if (action === "leave") {
      if (!groupId) {
        return NextResponse.json({ error: "Falta groupId." }, { status: 400 });
      }

      await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  } catch (error: any) {
    console.error("Groups error:", error);
    return NextResponse.json(
      { error: error.message || "Error en grupos." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    const supabase = supabaseAsUser(token);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "No userId" }, { status: 400 });
    }

    // Get groups where user is a member
    const { data: memberships } = await supabase
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", userId);

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ groups: [] });
    }

    const groupIds = memberships.map((m) => m.group_id);

    const { data: groups } = await supabase
      .from("groups")
      .select("id, name, join_code, owner_id, created_at")
      .in("id", groupIds);

    // Get member counts
    const groupsWithInfo = await Promise.all(
      (groups || []).map(async (g) => {
        const { count } = await supabase
          .from("group_members")
          .select("id", { count: "exact", head: true })
          .eq("group_id", g.id);

        const membership = memberships.find((m) => m.group_id === g.id);

        return {
          ...g,
          member_count: count || 0,
          role: membership?.role || "member",
        };
      })
    );

    return NextResponse.json({ groups: groupsWithInfo });
  } catch {
    return NextResponse.json({ groups: [] });
  }
}
