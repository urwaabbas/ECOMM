import { handleRegister } from "@/controllers/auth.controller";

export async function POST(request :Request){
  return handleRegister(request);
}

