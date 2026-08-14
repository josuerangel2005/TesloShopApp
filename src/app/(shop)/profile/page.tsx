import { redirect } from "next/navigation";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { Title, ProfileInfo } from "../../../../ui";

export default async function ProfilePage() {
  const handleAuthUseCase = getHandleAuthUseCase();

  const user = await handleAuthUseCase.getCurrentUser();

  if (!user) redirect("/");

  return (
    <div>
      <Title title="Perfil" subTitle="Tu información y estado de cuenta" />
      <ProfileInfo
        profile={{
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          role: user.getRole() as "USER" | "ADMIN",
          image: user.getImage(),
          emailVerified: user.getEmailVerified(),
        }}
      />
    </div>
  );
}
