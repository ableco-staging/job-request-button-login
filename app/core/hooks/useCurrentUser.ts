import { useQuery } from "blitz";
import getCurrentUser from "app/users/queries/getCurrentUser";

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null);
  if (!user) {
    console.log(
      "You're using useCurrentUser without protecting your page first.",
    );
  }
  return user!;
};
