import { titleFont } from "@/config/fonts";

export default function () {
  return (
    <div className="fade-in flex flex-1 flex-col items-center justify-center gap-8 px-6">
      <h1 className={`${titleFont.className}`}>New Account</h1>
    </div>
  );
}
