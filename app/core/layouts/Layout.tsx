import { ReactNode, Suspense } from "react";
import { Head } from "blitz";
import Header from "app/components/Header";

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "doable"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Suspense fallback={<span>Loading...</span>}>{children}</Suspense>
    </>
  );
};

export default Layout;
