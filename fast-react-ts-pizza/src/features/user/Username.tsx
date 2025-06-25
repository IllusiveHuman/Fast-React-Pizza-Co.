import { useCustomSelector } from "../../hook";

function Username() {
  const userName = useCustomSelector((store) => store.user.username);

  if (!userName) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{userName}</div>
  );
}

export default Username;
