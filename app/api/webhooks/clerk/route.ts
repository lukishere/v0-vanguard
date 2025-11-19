import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    console.log(`✅ [Webhook] New user created: ${id}`);
    console.log(`   Email: ${email_addresses[0]?.email_address}`);
    console.log(`   Name: ${first_name} ${last_name}`);

    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();

      // Initialize user with default metadata
      await client.users.updateUser(id, {
        publicMetadata: {
          role: "user",
          demoAccess: [],
          lastActivity: new Date().toISOString(),
        },
      });

      console.log(`✅ [Webhook] Initialized metadata for user: ${id}`);
    } catch (error) {
      console.error("❌ [Webhook] Failed to initialize user metadata:", error);
      return NextResponse.json(
        { error: "Failed to initialize user metadata" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

