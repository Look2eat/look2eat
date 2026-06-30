/**
 * Calls PATCH /admin/profile via our authenticated proxy
 * (/api/proxy/admin/profile), which attaches the JWT from the httpOnly
 * cookie as Authorization: Bearer server-side. Same pattern as every
 * other authenticated call — never touches the token directly.
 */

export interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
}

export const updateProfile = async (
  input: UpdateProfileInput,
): Promise<UpdateProfileResponse> => {
  const res = await fetch("/api/proxy/admin/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || data.error || "Could not update profile.",
    );
  }

  return data as UpdateProfileResponse;
};