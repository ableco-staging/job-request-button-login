import { GetServerSideProps, getSession, Routes } from "blitz";

const protectPage: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (!session.userId) {
    const url = req.url ?? "/";
    const loginPath = Routes.LoginPage().pathname;
    const destination = `${loginPath}?redirectUrl=${url}`;

    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default protectPage;
