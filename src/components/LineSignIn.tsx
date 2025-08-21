import { signIn } from "@/lib/auth/auth";

export default function LineSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("line");
      }}
    >
      <button type="submit">Signin with LINE</button>
    </form>
  );
}
